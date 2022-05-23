// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {DSTestPlus} from "./utils/DSTestPlus.sol";
import {Hevm} from "./utils/Hevm.sol";
import {Passport} from "../passport/Passport.sol";
import {Renderer} from "../passport/Renderer.sol";
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

    function testMintAndBurn() public {
        address citiz3n = address(0xBABE);

        evm.startPrank(citiz3n);
        (uint8 v, bytes32 r, bytes32 s) = getSignatures(privateKey);
        issuer.claim(v, r, s);

        passport.burn(0);
        assertEq(passport.totalSupply(), 0);
        assertEq(passport.balanceOf(citiz3n), 0);
        assertEq(passport.getNextId(), 1);
        evm.expectRevert("NOT_MINTED");
        passport.ownerOf(0);
    }

    function testWithdraw() public {
        startIssuance();
        (address citiz3n, uint256 privateKey) = getFilledAccount(0xDAD);

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
        passport.recoverTokens(token, 50 * 1e18, address(0xBABE));
        assertEq(token.balanceOf(address(0xBABE)), 50 * 1e18);

        // Exceeding amount should fail
        evm.expectRevert("TRANSFER_FAILED");
        passport.recoverTokens(token, 100 * 1e18, address(0xBABE));

        // Only owner should be able to execute
        evm.prank(address(0xBABE));
        evm.expectRevert(sig.selector("CallerIsNotAuthorized()"));
        passport.recoverTokens(token, 50 * 1e18, address(0xBABE));
    }
}
