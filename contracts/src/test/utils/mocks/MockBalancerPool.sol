// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";

contract MockBalancerPools {
    error idError();

    ERC20[] poolTokens;
    uint256[] poolTokensBalances;
    uint256 internal _lastChangeBlock;

    function setTokens(ERC20 tokenA, ERC20 tokenB) public virtual {
        poolTokens = new ERC20[](2);
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
            ERC20[] memory tokens,
            uint256[] memory balances,
            uint256 lastChangeBlock
        )
    {
        /// Remove warning
        if (poolId == 0) revert idError();
        return (poolTokens, poolTokensBalances, _lastChangeBlock);
    }
}
