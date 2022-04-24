// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.10;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {SafeTransferLib} from "@rari-capital/solmate/src/utils/SafeTransferLib.sol";
import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";

/// @notice Distributes rewards to LP providers.
/// @author Nation3 (https://github.com/nation3).
/// @dev Adapted from Rari-Capital rewards distributor (https://github.com/Rari-Capital/rari-governance-contracts/blob/master/contracts/RariGovernanceTokenUniswapDistributor.sol).
contract LiquidityRewardsDistributor is Initializable, Ownable {
    /*///////////////////////////////////////////////////////////////
                               LIBRARIES
    //////////////////////////////////////////////////////////////*/

    using SafeTransferLib for ERC20;

    /*///////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidStartBlock();
    error InvalidEndBlock();
    error InvalidRewardsAmount();
    error InsufficientStakeBalance();
    error InsufficientRewardsBalance();

    /*///////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event Claim(address indexed user, uint256 rewards);
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    /*///////////////////////////////////////////////////////////////
                        INMUTABLES / CONSTANTS
    //////////////////////////////////////////////////////////////*/

    /// @dev Used to correct precision errors on divisions.
    uint256 internal constant PRECISION = 1e30;

    /*///////////////////////////////////////////////////////////////
                                 STORAGE
    //////////////////////////////////////////////////////////////*/

    /// @notice The token rewarded to LP providers.
    ERC20 public rewardsToken;
    /// @notice The LP token accepted to stake by the contract.
    ERC20 public lpToken;

    /// @notice First block to distribute rewards.
    uint256 public startBlock;
    /// @notice Last block to distribute rewards.
    uint256 public endBlock;
    /// @notice Total LP tokens stakded by users.
    uint256 public totalStaked;
    /// @notice Total rewards beeing distributed.
    uint256 public totalRewards;
    /// @notice Rewards distributed to users.
    uint256 public distributedRewards;

    /// @dev Rewards per block on current rewards period
    /// @dev Only changes on rewards update.
    /// @dev Precision correction will be applied.
    uint256 internal _blockRewards;
    /// @dev Rewards per LP staked token at last distribution.
    uint256 internal _rewardsRate;
    /// @dev Las block in which rewards have been distributed.
    uint256 internal _lastDistributedBlock;

    /// @dev Amount of LP tokens staked by user.
    mapping(address => uint256) internal _userStaking;
    /// @dev Rewards per LP staked token at last user deposit.
    mapping(address => uint256) internal _userRatedRewards;
    /// @dev Distributed rewards to the user at last distribution.
    mapping(address => uint256) internal _userDistributedRewards;
    /// @dev Rewards claimed by user.
    mapping(address => uint256) internal _userClaimedRewards;

    /*///////////////////////////////////////////////////////////////
                             INITIALIZATION
    //////////////////////////////////////////////////////////////*/

    /// @dev Sets both rewards & lptoken.
    /// @param _rewardsToken The contract of the rewards token.
    /// @param _lpToken The contract of the liquidity pool tokens.
    function initialize(ERC20 _rewardsToken, ERC20 _lpToken) public initializer {
        rewardsToken = _rewardsToken;
        lpToken = _lpToken;
    }

    /*///////////////////////////////////////////////////////////////
                              ADMIN ACTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Set rewards amount & rewards period duration, can be used to update rewards destribution anytime in the future.
    /// @param amount The amount of reward tokens to set as rewards, expects this amount to be already transferred to the contract.
    /// @param _startBlock Initial block of the rewards distribution.
    /// @param _endBlock Final block of the rewards distribution.
    function setRewards(
        uint256 amount,
        uint256 _startBlock,
        uint256 _endBlock
    ) external virtual onlyOwner {
        if (amount - distributedRewards > rewardsToken.balanceOf(address(this))) revert InsufficientRewardsBalance();
        if (_startBlock < block.number) revert InvalidStartBlock();
        if (_endBlock <= _startBlock) revert InvalidEndBlock();

        // Distribute possible pending rewards
        if (totalStaked > 0) _updateRewardsdistribution();
        if (amount <= distributedRewards) revert InvalidRewardsAmount();

        // Set / reset variables
        totalRewards = amount;
        startBlock = _startBlock;
        endBlock = _endBlock;
        // Compute rewards that must be distributed each block, precision correction applied.
        _blockRewards = ((totalRewards - distributedRewards) * PRECISION) / (endBlock - startBlock);
    }

    /// @notice Allow the owner to withdraw any ERC20 sent to the contract.
    /// @param token Token to withdraw.
    /// @param to Recipient address of the tokens.
    function recoverTokens(ERC20 token, address to) external virtual onlyOwner returns (uint256 amount) {
        amount = token.balanceOf(address(this));
        if (token == lpToken) {
            amount = amount - totalStaked;
        } else if (token == rewardsToken) {
            amount = amount - totalRewards;
        }

        token.safeTransfer(to, amount);
    }

    /*///////////////////////////////////////////////////////////////
                                USER ACTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Returns the quantity of unclaimed rewards earned by `holder`.
    /// @param holder The holder of staked LP tokens.
    /// @return The quantity of unclaimed rewards tokens.
    function getUnclaimedRewards(address holder) external view virtual returns (uint256) {
        return _userDistributedRewards[holder] - _userClaimedRewards[holder];
    }

    /// @notice Returns the queantity of LP tokens staked by `holder`.
    /// @param holder the holder of staked LP tokens.
    /// @return The quantity of staked LP tokens.
    function getStakingBalance(address holder) external view virtual returns (uint256) {
        return _userStaking[holder];
    }

    /// @notice Deposits `amount` of LP tokens from sender to this contract.
    /// @param amount The amount ot LP tokens to deposit.
    function deposit(uint256 amount) external virtual {
        // Transfer LP token from sender
        lpToken.safeTransferFrom(msg.sender, address(this), amount);

        if (block.number > startBlock) {
            if (_userStaking[msg.sender] > 0) {
                // Distribute rewards until this point and update snapshot of rewards per LP Token
                _distributeRewards(msg.sender);
            } else {
                // On first deposit update distribution and set initial user snapshot of rewards per LP Token
                _updateRewardsdistribution();
                _userRatedRewards[msg.sender] = _rewardsRate;
            }
        }

        // Add to staking balance
        _userStaking[msg.sender] = _userStaking[msg.sender] + amount;
        totalStaked = totalStaked + amount;

        emit Deposit(msg.sender, amount);
    }

    /// @notice Withdraws `amount` of LP tokens from this contract to sender.
    /// @param amount The amount of LP tokens to withdraw.
    function withdraw(uint256 amount) external virtual {
        if (amount > _userStaking[msg.sender]) revert InsufficientStakeBalance();
        if (block.number > startBlock) _distributeRewards(msg.sender);

        // Substract from staking balance
        _userStaking[msg.sender] = _userStaking[msg.sender] - amount;
        totalStaked = totalStaked - amount;

        // Transfer out to sender
        lpToken.safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount);
    }

    /// @notice Claims all of `msg.sender` unclaimed rewards.
    /// @return The quantity of rewards tokens claimed.
    function claimRewards() external virtual returns (uint256) {
        // Distribute rewards to holder
        if (block.number > startBlock) _distributeRewards(msg.sender);

        // Get unclaimed rewards
        uint256 unclaimedRewards = _userDistributedRewards[msg.sender] - _userClaimedRewards[msg.sender];
        if (unclaimedRewards <= 0) revert InsufficientRewardsBalance();

        // Register claimed rewards and transfer out
        _userClaimedRewards[msg.sender] = _userClaimedRewards[msg.sender] + unclaimedRewards;
        rewardsToken.safeTransfer(msg.sender, unclaimedRewards);

        emit Claim(msg.sender, unclaimedRewards);

        return unclaimedRewards;
    }

    /// @notice Withdraw all LP tokens and unclaimed rewards to sender.
    /// @return stakingAmount The staking amount drained.
    /// @return unclaimedRewards The quantity of rewards tokens claimed.
    function withdrawAndClaim() external virtual returns (uint256 stakingAmount, uint256 unclaimedRewards) {
        // Distribute rewards to holder
        if (block.number > startBlock) _distributeRewards(msg.sender);

        stakingAmount = _userStaking[msg.sender];
        unclaimedRewards = _userDistributedRewards[msg.sender] - _userClaimedRewards[msg.sender];

        // Drain holder staking and update claimed rewards
        _userStaking[msg.sender] = 0;
        totalStaked = totalStaked - stakingAmount;
        _userClaimedRewards[msg.sender] = _userClaimedRewards[msg.sender] + unclaimedRewards;

        // Transfer out LP tokens & rewards
        lpToken.safeTransfer(msg.sender, stakingAmount);
        rewardsToken.safeTransfer(msg.sender, unclaimedRewards);

        emit Withdraw(msg.sender, stakingAmount);
        emit Claim(msg.sender, unclaimedRewards);
    }

    /*///////////////////////////////////////////////////////////////
                       INTERNAL DISTRIBUTION LOGIC
    //////////////////////////////////////////////////////////////*/

    /// @dev Distributes all undistributed rewards earned by `holder`.
    /// @dev Do not reverts on if there is no rewards to distribute.
    /// @param holder The LP Token staker whose rewards are to be distributed.
    /// @return The quantity of rewards distributed.
    function _distributeRewards(address holder) internal virtual returns (uint256) {
        uint256 holderStake = _userStaking[holder];
        if (holderStake <= 0) return 0;

        _updateRewardsdistribution();

        // Compute undistributed rewards from the delta in rewardsRate since the user deposited
        uint256 undistributedRewards = (holderStake * (_rewardsRate - _userRatedRewards[holder])) / PRECISION;
        if (undistributedRewards <= 0) return 0;

        _userRatedRewards[holder] = _rewardsRate;
        _userDistributedRewards[holder] = _userDistributedRewards[holder] + undistributedRewards;
        return undistributedRewards;
    }

    /// @dev Updates rewards distribution values.
    /// Distributes rewards in all blocks, including empty staking ones.
    function _updateRewardsdistribution() internal virtual {
        if (totalRewards <= 0) return;
        if (_lastDistributedBlock < startBlock) _lastDistributedBlock = startBlock;

        uint256 blocksToDistribute;
        if (block.number <= endBlock) {
            blocksToDistribute = block.number - _lastDistributedBlock;
        } else {
            blocksToDistribute = endBlock - _lastDistributedBlock;
        }

        uint256 rewardsToDistribute = _blockRewards * blocksToDistribute;

        if (rewardsToDistribute <= 0) return;

        _lastDistributedBlock = block.number;

        // Update rewards per LP token only if there are staked tokens
        if (totalStaked > 0) {
            distributedRewards = distributedRewards + rewardsToDistribute / PRECISION;
            _rewardsRate = _rewardsRate + rewardsToDistribute / totalStaked;
        }
    }
}
