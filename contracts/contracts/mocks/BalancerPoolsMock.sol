// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BalancerPoolsMock {
    error idError();

    IERC20[] poolTokens;
    uint256[] poolTokensBalances;
    uint256 internal _lastChangeBlock;

    function setTokens(IERC20 tokenA, IERC20 tokenB) public virtual {
        poolTokens = new IERC20[](2);
        poolTokens[0] = tokenA;
        poolTokens[1] = tokenB;

        poolTokensBalances = new uint256[](2);
        poolTokensBalances[0] = 2000 * 1e18;
        poolTokensBalances[1] = 200 * 1e18;

        _lastChangeBlock = block.number;
    }

    function getPoolTokens(bytes32 poolId)
        external
        view
        returns (
            IERC20[] memory tokens,
            uint256[] memory balances,
            uint256 lastChangeBlock
        )
    {
        /// Remove warning
        if (poolId == 0) revert idError();
        return (poolTokens, poolTokensBalances, _lastChangeBlock);
    }
}
