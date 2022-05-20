// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {DSTestPlus} from "./utils/DSTestPlus.sol";
import {Hevm} from "./utils/Hevm.sol";
import {Passport} from "../passport/Passport.sol";
import {PassportIssuer} from "../passport/PassportIssuer.sol";
import {Signatures as sig} from "./utils/Signatures.sol";
import {MockVotingEscrow} from "./utils/mocks/MockVotingEscrow.sol";

contract PassportIssuerTest is DSTestPlus {
    Hevm evm = Hevm(HEVM_ADDRESS);

    Passport passport;
    PassportIssuer issuer;
    MockVotingEscrow veToken;

    uint256 constant MAX_PASSPORT_ISSUANCES = 3;
    uint256 constant MIN_LOCKED_AMOUNT = 10 * 1e18;

    uint8 constant REVOKE_UNDER_RATIO = 80; // %

    function setUp() public {
        passport = new Passport("Passport", "PAS3");
        veToken = new MockVotingEscrow("Nation3 Voting Escrow Token", "veNATION");
        issuer = new PassportIssuer();

        issuer.initialize(veToken, passport);
        passport.transferControl(address(issuer));
    }

    function startIssuance() public {
        issuer.setParams(MAX_PASSPORT_ISSUANCES, MIN_LOCKED_AMOUNT, REVOKE_UNDER_RATIO);
        issuer.setEnabled(true);
    }

    function getFilledAccount(address account) public returns (address) {
        veToken.setBalance(account, MIN_LOCKED_AMOUNT * 2);
        return account;
    }

    function testClaim() public {
        startIssuance();
        address citiz3n = getFilledAccount(address(0xBABE));

        evm.prank(citiz3n);
        issuer.claim();

        assertTrue(issuer.hasPassport(citiz3n));
        assertEq(issuer.totalIssued(), 1);
        assertEq(passport.ownerOf(issuer.passportId(citiz3n)), citiz3n);
    }

    function testWithdraw() public {
        startIssuance();
        address citiz3n = getFilledAccount(address(0xBABE));

        evm.startPrank(citiz3n);

        issuer.claim();
        issuer.withdraw();

        evm.stopPrank();

        evm.expectRevert(sig.selector("PassportNotIssued()"));
        issuer.passportId(citiz3n);

        assertEq(passport.balanceOf(citiz3n), 0);
        assertFalse(issuer.hasPassport(citiz3n));
        assertEq(issuer.totalIssued(), 1);
    }

    function testRevoke() public {
        startIssuance();
        address citiz3n = address(0xBABE);
        address guardian = address(0xDEAD);

        evm.prank(guardian);
        evm.expectRevert(sig.selector("PassportNotIssued()"));
        issuer.revoke(citiz3n);

        getFilledAccount(citiz3n);

        evm.prank(citiz3n);
        issuer.claim();

        // Citizen veToken balance go under threshold
        veToken.setBalance(citiz3n, MIN_LOCKED_AMOUNT / 2);

        // Any account can revoke
        evm.prank(guardian);
        issuer.revoke(citiz3n);

        assertEq(passport.balanceOf(citiz3n), 0);
        assertFalse(issuer.hasPassport(citiz3n));
        assertEq(issuer.totalIssued(), 1);
    }

    function testCannotRevokeEligibleAccount() public {
        startIssuance();
        address citiz3n = getFilledAccount(address(0xBABE));
        address guardian = address(0xDEAD);

        evm.prank(citiz3n);
        issuer.claim();

        evm.prank(guardian);
        evm.expectRevert(sig.selector("StillEligible()"));
        issuer.revoke(citiz3n);
    }

    function testCannotClaimMoreThanOnePassport() public {
        startIssuance();
        address citiz3n = getFilledAccount(address(0xBABE));

        evm.startPrank(citiz3n);

        issuer.claim();

        evm.expectRevert(sig.selector("PassportAlreadyIssued()"));
        issuer.claim();

        evm.stopPrank();
    }
}
