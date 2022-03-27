// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {DSTestPlus} from "./utils/DSTestPlus.sol";
import {Hevm} from "./utils/Hevm.sol";
import {PassportNFT} from "../passport/Passport.sol";
import {Signatures as sig} from "./utils/Signatures.sol";
import {ERC20Mock} from "../mocks/ERC20Mock.sol";

contract PassportTest is DSTestPlus {

    Hevm evm = Hevm(HEVM_ADDRESS);

    PassportNFT pass;

    function setUp() public {
        pass = new PassportNFT("Passport", "PAS3");
    }

    function testMetadata() public {
        assertEq(pass.name(), "Passport");
        assertEq(pass.symbol(), "PAS3");
    }

    function testMintAndBurn() public {
        address citiz3n = address(0xBABE);

        pass.mint(citiz3n);

        assertEq(pass.totalSupply(), 1);
        assertEq(pass.balanceOf(citiz3n), 1);
        assertEq(pass.ownerOf(0), citiz3n);

        pass.burn(0);
        assertEq(pass.totalSupply(), 0);
        assertEq(pass.balanceOf(citiz3n), 0);
        assertEq(pass.ownerOf(0), address(0));
        assertEq(pass.getNextId(), 1);
    }

    function testOwnerIsAlwaysAllowedToTransfer() public {
        address citiz3nA = address(0xBABE);
        address citiz3nB = address(0xBEEF);
        address newOwner = address(0xDAD);

        // Mint token under default contract owner
        pass.mint(citiz3nA);
        
        // Transfer contract ownership
        pass.transferOwnership(newOwner);
        evm.startPrank(newOwner);

        // New owner execute transfer without previous allowance
        pass.transferFrom(citiz3nA, citiz3nB, 0);

        assertEq(pass.balanceOf(citiz3nA), 0);
        assertEq(pass.balanceOf(citiz3nB), 1);
        assertEq(pass.ownerOf(0), citiz3nB);

        // Transfer back using safeTransfer this time
        pass.safeTransferFrom(citiz3nB, citiz3nA, 0);

        assertEq(pass.balanceOf(citiz3nA), 1);
        assertEq(pass.balanceOf(citiz3nB), 0);
        assertEq(pass.ownerOf(0), citiz3nA);

        evm.stopPrank();
    }

    function testOnlyOwnerCanMint() public {
        address notOwner = address(0xBEEF);

        evm.startPrank(notOwner);

        evm.expectRevert("Ownable: caller is not the owner");
        pass.mint(address(0xBABE));

        evm.expectRevert("Ownable: caller is not the owner");
        pass.safeMint(address(0xBABE));

        evm.stopPrank();
    }

    function testOnlyOwnerCanBurn() public {
        address notOwner = address(0xBEEF);

        pass.mint(address(0xBABE));

        evm.prank(notOwner);
        evm.expectRevert("Ownable: caller is not the owner");
        pass.burn(0);
    }

    function testTokenRecovery() public {
        ERC20Mock token = new ERC20Mock("Token", "TKN", 100*1e18);
        token.transfer(address(pass), 100*1e18);

        // Valid recovery
        pass.recoverTokens(token, 50*1e18, address(0xBABE));
        assertEq(token.balanceOf(address(0xBABE)), 50*1e18);

        // Exceeding amount should fail
        evm.expectRevert("ERC20: transfer amount exceeds balance");
        pass.recoverTokens(token, 100*1e18, address(0xBABE));

        // Only owner should be able to execute
        evm.prank(address(0xBABE));
        evm.expectRevert("Ownable: caller is not the owner");
        pass.recoverTokens(token, 50*1e18, address(0xBABE));
    }
}
