// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {DSTestPlus} from "./utils/DSTestPlus.sol";
import {Hevm} from "./utils/Hevm.sol";
import {PassportNFT} from "../passport/Passport.sol";
import {Signatures as sig} from "./utils/Signatures.sol";
import {ERC20Mock} from "../mocks/ERC20Mock.sol";

contract PassportTest is DSTestPlus {
    Hevm evm = Hevm(HEVM_ADDRESS);

    PassportNFT passport;

    function setUp() public {
        passport = new PassportNFT("Passport", "PAS3");
    }

    function testMetadata() public {
        assertEq(passport.name(), "Passport");
        assertEq(passport.symbol(), "PAS3");
    }

    function testMintAndBurn() public {
        address citiz3n = address(0xBABE);

        passport.mint(citiz3n);

        assertEq(passport.totalSupply(), 1);
        assertEq(passport.balanceOf(citiz3n), 1);
        assertEq(passport.ownerOf(0), citiz3n);

        passport.burn(0);
        assertEq(passport.totalSupply(), 0);
        assertEq(passport.balanceOf(citiz3n), 0);
        assertEq(passport.ownerOf(0), address(0));
        assertEq(passport.getNextId(), 1);
    }

    function testOwnerIsAlwaysAllowedToTransfer() public {
        address citiz3nA = address(0xBABE);
        address citiz3nB = address(0xBEEF);
        address newController = address(0xDAD);

        // Mint token under default contract owner
        passport.mint(citiz3nA);

        // Transfer contract ownership
        passport.transferControl(newController);
        evm.startPrank(newController);

        // New controller execute transfer without previous allowance
        passport.transferFrom(citiz3nA, citiz3nB, 0);

        assertEq(passport.balanceOf(citiz3nA), 0);
        assertEq(passport.balanceOf(citiz3nB), 1);
        assertEq(passport.ownerOf(0), citiz3nB);

        // Transfer back using safeTransfer this time
        passport.safeTransferFrom(citiz3nB, citiz3nA, 0);

        assertEq(passport.balanceOf(citiz3nA), 1);
        assertEq(passport.balanceOf(citiz3nB), 0);
        assertEq(passport.ownerOf(0), citiz3nA);

        evm.stopPrank();
    }

    function testOnlyOwnerCanMint() public {
        address notOwner = address(0xBEEF);

        evm.startPrank(notOwner);

        evm.expectRevert(sig.selector("CallerIsNotController()"));
        passport.mint(address(0xBABE));

        evm.expectRevert(sig.selector("CallerIsNotController()"));
        passport.safeMint(address(0xBABE));

        evm.stopPrank();
    }

    function testOnlyOwnerCanBurn() public {
        address notOwner = address(0xBEEF);

        passport.mint(address(0xBABE));

        evm.prank(notOwner);
        evm.expectRevert(sig.selector("CallerIsNotController()"));
        passport.burn(0);
    }

    function testTokenRecovery() public {
        ERC20Mock token = new ERC20Mock("Token", "TKN", 100 * 1e18);
        token.transfer(address(passport), 100 * 1e18);

        // Valid recovery
        passport.recoverTokens(token, 50 * 1e18, address(0xBABE));
        assertEq(token.balanceOf(address(0xBABE)), 50 * 1e18);

        // Exceeding amount should fail
        evm.expectRevert("ERC20: transfer amount exceeds balance");
        passport.recoverTokens(token, 100 * 1e18, address(0xBABE));

        // Only owner should be able to execute
        evm.prank(address(0xBABE));
        evm.expectRevert(sig.selector("CallerIsNotOwner()"));
        passport.recoverTokens(token, 50 * 1e18, address(0xBABE));
    }
}
