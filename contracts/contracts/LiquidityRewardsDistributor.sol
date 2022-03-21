// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

error InvalidEndBlock();
error InvalidRewardsAmount();
error InsufficientRewardsBalance();
error InsufficientStakeBalance();

/// @notice Distributes rewards to LP providers
/// @author Nation3 (https://github.com/nation3)
/// Adapted from https://github.com/Rari-Capital/rari-governance-contracts/blob/master/contracts/RariGovernanceTokenUniswapDistributor.sol
contract LiquidityRewardsDistributor is Initializable, Ownable {
    // TODO: Add events

    using SafeERC20 for IERC20;

    IERC20 public rewardsToken;
    IERC20 public lpToken;

    uint256 public distributionStartBlock;
    uint256 public distributionEndBlock;
    uint256 public totalRewards;
    uint256 public totalStaked;

    uint256 internal _currentDistributionDuration;
    uint256 internal _lastDistributedRewards;
    uint256 internal _lastLpTokenRewards;

    mapping(address => uint256) internal _accountStakingBalance;
    mapping(address => uint256) internal _accountLastLpTokenRewards;
    mapping(address => uint256) internal _accountDistributedRewards;
    mapping(address => uint256) internal _accountClaimedRewards;

    /// @dev Sets both rewards & lptoken
    function initialize(
        IERC20 _rewardsToken,
        IERC20 _lpToken
    ) public initializer {
        // _transferOwnership(msg.sender);
        rewardsToken = _rewardsToken;
        lpToken = _lpToken;
    }

    /// @notice Set rewards amount & rewards period duration, can be used to update rewards destribution anytime in the future
    /// @param amount The amount of reward tokens to set as rewards, expects this amount to be already transferred to the contract
    /// @param _distributionEndBlock Endblock of the rewards distribution
    function setRewards(
        uint256 amount,
        uint256 _distributionEndBlock
    ) external virtual onlyOwner {
        if (amount > rewardsToken.balanceOf(address(this))) revert InsufficientRewardsBalance();
        if (amount <= _lastDistributedRewards) revert InvalidRewardsAmount();
        if (_distributionEndBlock <= block.number) revert InvalidEndBlock();

        // If already were rewards in place distribute them until this point
        if (totalRewards > _lastDistributedRewards) _updateRewardsdistribution();

        // Reset variables
        totalRewards = amount;
        distributionStartBlock = block.number;
        distributionEndBlock = _distributionEndBlock;
        _currentDistributionDuration = distributionEndBlock - distributionStartBlock;
    }

     /// @notice Returns the quantity of unclaimed rewards earned by `holder`
     /// @param holder The holder of staked LP tokens
     /// @return The quantity of unclaimed rewards tokens
    function getUnclaimedRewards(address holder) external view virtual returns (uint256) {
        return _accountDistributedRewards[holder] - _accountClaimedRewards[holder];
    }

    /// @notice Returns the queantity of LP tokens staked by `holder`
    /// @param holder the holder of staked LP tokens
    /// @return The quantity of staked LP tokens
    function getStakingBalance(address holder) external view virtual returns (uint256) {
        return _accountStakingBalance[holder];
    }

    /// @notice Deposits `amount` of LP tokens from sender to this contract
    /// @param amount The amount ot LP tokens to deposit
    function deposit(uint256 amount) external virtual {
        // Transfer LP token from sender
        lpToken.safeTransferFrom(msg.sender, address(this), amount);

        if (block.number > distributionStartBlock) {
            if (_accountStakingBalance[msg.sender] > 0) {
                // Distribute rewards until this point and update snapshot of rewards per LP Token
                _distributeRewards(msg.sender);
            } else {
                // On first deposit update distribution and set initial account snapshot of rewards per LP Token
                _updateRewardsdistribution();
                _accountLastLpTokenRewards[msg.sender] = _lastLpTokenRewards;
            }
        }

        // Add to staking balance
        _accountStakingBalance[msg.sender] = _accountStakingBalance[msg.sender] + amount;
        totalStaked = totalStaked + amount;
    }

    /// @notice Withdraws `amount` of LP tokens from this contract to sender
    /// @param amount The amount of LP tokens to withdraw
    function withdraw(uint256 amount) external virtual {
        if (amount > _accountStakingBalance[msg.sender]) revert InsufficientStakeBalance();
        if (block.number > distributionStartBlock) _distributeRewards(msg.sender);

        // Substract from staking balance
        _accountStakingBalance[msg.sender] = _accountStakingBalance[msg.sender] - amount;
        totalStaked = totalStaked - amount;

        // Transfer out to sender
        lpToken.safeTransfer(msg.sender, amount);
    }

    /// @notice Claims all of `msg.sender` unclaimed rewards
    /// @return The quantity of rewards tokens claimed
    function claimRewards() external virtual returns (uint256){
        // Distribute rewards to holder
        if (block.number > distributionStartBlock) _distributeRewards(msg.sender);

        // Get unclaimed rewards
        uint256 unclaimedRewards = _accountDistributedRewards[msg.sender] - _accountClaimedRewards[msg.sender];
        if ( unclaimedRewards <= 0 ) revert InsufficientRewardsBalance();

        // Register claimed rewards and transfer out
        _accountClaimedRewards[msg.sender] = _accountClaimedRewards[msg.sender] + unclaimedRewards;
        rewardsToken.safeTransfer(msg.sender, unclaimedRewards);
        return unclaimedRewards;
    }

    /// @notice Withdraw all LP tokens and unclaimed rewards to sender
    /// @return stakingAmount The staking amount drained 
    /// @return unclaimedRewards The quantity of rewards tokens claimed
    function withdrawAndClaim() external virtual returns (
        uint256 stakingAmount,
        uint256 unclaimedRewards
    ){
        // Distribute rewards to holder
        if (block.number > distributionStartBlock) _distributeRewards(msg.sender);

        stakingAmount = _accountStakingBalance[msg.sender];
        unclaimedRewards = _accountDistributedRewards[msg.sender] - _accountClaimedRewards[msg.sender];

        // Drain holder staking and update claimed rewards
        _accountStakingBalance[msg.sender] = 0;
        totalStaked = totalStaked - stakingAmount;
        _accountClaimedRewards[msg.sender] = _accountClaimedRewards[msg.sender] + unclaimedRewards;

        // Transfer out LP tokens & rewards
        lpToken.safeTransfer(msg.sender, stakingAmount);
        rewardsToken.safeTransfer(msg.sender, unclaimedRewards);
    }

    // @dev Distributes all undistributed rewards earned by `holder`, do not reverts on if there is no rewards to distribute
    // @param holder The LP Token staker whose rewards are to be distributed
    // @return The quantity of rewards distributed
    function _distributeRewards(address holder) internal virtual returns (uint256) {
        uint256 holderStake = _accountStakingBalance[holder];
        if (holderStake <= 0) return 0;

        _updateRewardsdistribution();

        uint256 undistributedRewards = holderStake * (_lastLpTokenRewards - _accountLastLpTokenRewards[holder]);
        if (undistributedRewards <= 0) return 0;

        _accountLastLpTokenRewards[holder] = _lastLpTokenRewards;
        _accountDistributedRewards[holder] = _accountDistributedRewards[holder] + undistributedRewards;
        return undistributedRewards;
    }
    
    // @dev Updates rewards distribution values
    function _updateRewardsdistribution() internal virtual {
        if (totalRewards <= 0) return;
        uint256 blocksSinceStart = block.number - distributionStartBlock;
        // Rewards that should be distributed until this point
        uint256 distributedRewards = totalRewards * blocksSinceStart / _currentDistributionDuration;
        // Rewards to distribute since last distribution
        uint256 rewardsToDistribute = distributedRewards - _lastDistributedRewards;
        if (rewardsToDistribute <= 0) return;

        _lastDistributedRewards = distributedRewards;

        // Update rewards per LP token only if there are staked tokens
        if (totalStaked > 0) _lastLpTokenRewards = _lastLpTokenRewards + rewardsToDistribute / totalStaked;
    }
}
