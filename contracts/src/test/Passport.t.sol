// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {DSTestPlus} from "./utils/DSTestPlus.sol";
import {Hevm} from "./utils/Hevm.sol";
import {Passport} from "../passport/Passport.sol";
import {Renderer} from "../passport/render/Renderer.sol";
import {Signatures as sig} from "./utils/Signatures.sol";
import {MockERC20} from "./utils/mocks/MockERC20.sol";

contract MockRenderer is Renderer {
    function render(
        uint256 tokenId,
        address owner,
        uint256 timestamp
    ) public pure override returns (string memory tokenURI) {
        tokenURI = string(
            abi.encodePacked(
                "Passport num. ",
                Strings.toString(tokenId),
                " owned by ",
                Strings.toHexString(uint256(uint160(owner))),
                " since ",
                Strings.toString(timestamp)
            )
        );
    }
}

contract PassportTest is DSTestPlus {
    Hevm evm = Hevm(HEVM_ADDRESS);

    Passport passport;

    function setUp() public {
        passport = new Passport("Passport", "PAS3");
        Renderer renderer = new MockRenderer();
        passport.setRenderer(renderer);
    }

    function testMetadata() public {
        assertEq(passport.name(), "Passport");
        assertEq(passport.symbol(), "PAS3");
    }

    function testMint() public {
        address citiz3n = address(0xBABE);

        evm.warp(314);
        passport.mint(citiz3n);

        assertEq(passport.totalSupply(), 1);
        assertEq(passport.balanceOf(citiz3n), 1);
        assertEq(passport.ownerOf(0), citiz3n);
        assertEq(passport.timestampOf(0), 314);
        assertEq(passport.signerOf(0), citiz3n);
    }

    function testBurn() public {
        address citiz3n = address(0xBABE);
        passport.mint(citiz3n);

        passport.burn(0);

        assertEq(passport.totalSupply(), 0);
        assertEq(passport.balanceOf(citiz3n), 0);
        assertEq(passport.getNextId(), 1);
        evm.expectRevert("NOT_MINTED");
        passport.ownerOf(0);
        evm.expectRevert(sig.selector("NotMinted()"));
        passport.signerOf(0);
    }

    function testTokenURI() public {
        address citiz3n = address(0xBABE);
        evm.warp(314);
        passport.mint(citiz3n);

        string memory uri = passport.tokenURI(0);

        assertEq(uri, "Passport num. 0 owned by 0xbabe since 314");
    }

    function testControllerIsAlwaysAllowedToTransfer() public {
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

    function testOnlyControllerCanMint() public {
        address notOwner = address(0xBEEF);

        evm.startPrank(notOwner);

        evm.expectRevert(sig.selector("CallerIsNotAuthorized()"));
        passport.mint(address(0xBABE));

        evm.expectRevert(sig.selector("CallerIsNotAuthorized()"));
        passport.safeMint(address(0xBABE));

        evm.stopPrank();
    }

    function testOnlyControllerCanBurn() public {
        address notOwner = address(0xBEEF);

        passport.mint(address(0xBABE));

        evm.prank(notOwner);
        evm.expectRevert(sig.selector("CallerIsNotAuthorized()"));
        passport.burn(0);
    }

    function testTokenRecovery() public {
        MockERC20 token = new MockERC20("Token", "TKN", 100 * 1e18);
        token.transfer(address(passport), 100 * 1e18);

        // Valid recovery
        passport.recoverTokens(token, address(0xBABE));
        assertEq(token.balanceOf(address(0xBABE)), 100 * 1e18);

        // Only owner should be able to execute
        evm.prank(address(0xBABE));
        evm.expectRevert(sig.selector("CallerIsNotAuthorized()"));
        passport.recoverTokens(token, address(0xBABE));
    }

    function testSetSigner() public {
        address account = address(0xBEEF);

        passport.mint(account);
        assertEq(passport.signerOf(0), account);

        evm.expectRevert(sig.selector("NotAuthorized()"));
        passport.setSigner(0, address(0xDAD));

        evm.prank(account);
        passport.setSigner(0, address(0xDAD));

        assertEq(passport.signerOf(0), address(0xDAD));
    }
}
