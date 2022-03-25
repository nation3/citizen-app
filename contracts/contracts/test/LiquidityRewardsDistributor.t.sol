// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {DSTestPlus} from "./utils/DSTestPlus.sol";
import {Hevm} from "./utils/evm.sol";
import {ERC20Mock} from "../mocks/ERC20Mock.sol";
import {LiquidityRewardsDistributor, InvalidEndBlock, InsufficientRewardsBalance} from "../LiquidityRewardsDistributor.sol";

contract RewardsDistributorTest is DSTestPlus {
    Hevm evm = Hevm(HEVM_ADDRESS);

    ERC20Mock rewardsToken;
    ERC20Mock lpToken;
    LiquidityRewardsDistributor distributor;

    uint256 public constant tokenSupply = 4206900 * 1e18;
    uint256 public constant totalRewards = 30000 * 1e18;
    uint256 public constant rewardsPeriod = 300; // Blocks

    function setUp() public {
        rewardsToken = new ERC20Mock("Nation3 Network Token", "NATION", tokenSupply);
        lpToken = new ERC20Mock("ETH/NATION Balancer Token", "ETHNATION", tokenSupply);

        distributor = new LiquidityRewardsDistributor();
        distributor.initialize(rewardsToken, lpToken);
    }

    function setRewards() public {
        rewardsToken.transfer(address(distributor), totalRewards);
        distributor.setRewards(totalRewards, block.number + rewardsPeriod);
    }

    function testSetRewards() public {
        setRewards();
    }

    function testCannotSetWithoutTransferRewards() public {
        evm.expectRevert(InsufficientRewardsBalance.selector);
        distributor.setRewards(totalRewards, block.number + rewardsPeriod);
    }

    function testCannotSetPastEndBlock() public {
        rewardsToken.transfer(address(distributor), totalRewards);
        evm.expectRevert(InvalidEndBlock.selector);
        distributor.setRewards(totalRewards, block.number);
    }

    function testSingleDepositFullTime() public {
        setRewards();

        uint256 rewardsStartBlock = distributor.distributionStartBlock();
        uint256 rewardsEndBlock = distributor.distributionEndBlock();
        uint256 depositAmount = 1337 *1e18;
        lpToken.approve(address(distributor), depositAmount);

        distributor.deposit(depositAmount);

        evm.roll(rewardsEndBlock);

        (uint256 staking, uint256 rewards) = distributor.withdrawAndClaim();

        assertEq(staking, depositAmount);
        // Precision of 5 * 1e(-18)
        assertApproxEq(rewards, totalRewards, 1);
    }
}
