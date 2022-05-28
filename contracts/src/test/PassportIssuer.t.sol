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

    uint256 constant MAX_PASSPORT_ISSUANCES = 2;
    uint256 constant CLAIM_REQUIRED_BALANCE = 10 * 1e18;
    uint256 constant REVOKE_UNDER_BALANCE = 75 * 1e17;

    string public statement = "I agree";
    string public termsURI = "42069.url";

    function setUp() public {
        passport = new Passport("Passport", "PAS3");
        veToken = new MockVotingEscrow("Nation3 Voting Escrow Token", "veNATION");
        issuer = new PassportIssuer();

        issuer.initialize(veToken, passport, MAX_PASSPORT_ISSUANCES);
        passport.transferControl(address(issuer));
    }

    function startIssuance() public {
        issuer.setParams(CLAIM_REQUIRED_BALANCE, REVOKE_UNDER_BALANCE);
        issuer.setStatement(statement);
        issuer.setTermsURI(termsURI);
        issuer.setEnabled(true);
    }

    function getFilledAccount(uint256 key) public returns (address, uint256) {
        return getAccount(key, CLAIM_REQUIRED_BALANCE * 2);
    }

    function getEmptyAccount(uint256 key) public returns (address, uint256) {
        return getAccount(key, 0);
    }

    function getAccount(uint256 key, uint256 balance) public returns (address, uint256) {
        address account = evm.addr(key);
        veToken.setBalance(account, balance);
        return (account, key);
    }

    function getSignatures(uint256 privateKey)
        public
        returns (
            uint8 v,
            bytes32 r,
            bytes32 s
        )
    {
        bytes32 message = keccak256(
            abi.encodePacked(
                "\x19\x01",
                issuer.DOMAIN_SEPARATOR(),
                keccak256(
                    abi.encode(
                        keccak256("Agreement(string statement,string termsURI)"),
                        keccak256(abi.encodePacked(statement)),
                        keccak256(abi.encodePacked(termsURI))
                    )
                )
            )
        );

        (v, r, s) = hevm.sign(privateKey, message);
    }

    function claimPassportWith(address account, uint256 privateKey) public {
        evm.startPrank(account);
        (uint8 v, bytes32 r, bytes32 s) = getSignatures(privateKey);
        issuer.claim(v, r, s);
        evm.stopPrank();
    }

    function testClaim() public {
        startIssuance();
        (address citiz3n, uint256 privateKey) = getFilledAccount(0xDAD);
        claimPassportWith(citiz3n, privateKey);

        assertEq(issuer.passportStatus(citiz3n), 1);
        assertEq(issuer.totalIssued(), 1);
        assertEq(passport.ownerOf(issuer.passportId(citiz3n)), citiz3n);
    }

    function testCannotClaimDisabled() public {
        startIssuance();
        issuer.setEnabled(false);
        (address citiz3n, uint256 privateKey) = getFilledAccount(0xBABE);
        (uint8 v, bytes32 r, bytes32 s) = getSignatures(privateKey);

        evm.prank(citiz3n);
        evm.expectRevert(sig.selector("IssuanceIsDisabled()"));
        issuer.claim(v, r, s);
    }

    function testCannotClaimLimitReached() public {
        startIssuance();
        (address citiz3nA, uint256 privateKeyA) = getFilledAccount(0xDAD);
        (address citiz3nB, uint256 privateKeyB) = getFilledAccount(0xBABE);
        (address citiz3nC, uint256 privateKeyC) = getFilledAccount(0xBEEF);

        claimPassportWith(citiz3nA, privateKeyA);
        claimPassportWith(citiz3nB, privateKeyB);

        (uint8 v, bytes32 r, bytes32 s) = getSignatures(privateKeyC);
        evm.prank(citiz3nC);
        evm.expectRevert(sig.selector("IssuancesLimitReached()"));
        issuer.claim(v, r, s);
    }

    function testRenounce() public {
        startIssuance();
        (address citiz3n, uint256 privateKey) = getFilledAccount(0xDAD);
        claimPassportWith(citiz3n, privateKey);

        evm.prank(citiz3n);
        issuer.renounce();

        assertEq(passport.balanceOf(citiz3n), 0);
        assertEq(issuer.passportStatus(citiz3n), 2);
        assertEq(issuer.totalIssued(), 1);
    }

    function testCannotClaimMoreThanOnePassport() public {
        startIssuance();
        (address citiz3n, uint256 privateKey) = getFilledAccount(0xBABE);
        (uint8 v, bytes32 r, bytes32 s) = getSignatures(privateKey);

        evm.startPrank(citiz3n);
        issuer.claim(v, r, s);

        // Try to claim with an already issued passport
        evm.expectRevert(sig.selector("PassportAlreadyIssued()"));
        issuer.claim(v, r, s);

        // Try to claim after withdraw
        issuer.renounce();
        evm.expectRevert(sig.selector("PassportAlreadyIssued()"));
        issuer.claim(v, r, s);

        evm.stopPrank();
    }

    function testRevoke() public {
        startIssuance();
        (address citiz3n, uint256 privateKey) = getFilledAccount(0xDAD);
        address guardian = address(0xDEAD);

        claimPassportWith(citiz3n, privateKey);

        // Citizen veToken balance goes under revoke threshold
        veToken.setBalance(citiz3n, CLAIM_REQUIRED_BALANCE / 2);

        // Any account can revoke
        evm.prank(guardian);
        issuer.revoke(citiz3n);

        assertEq(passport.balanceOf(citiz3n), 0);
        assertEq(issuer.passportStatus(citiz3n), 2);
        assertEq(issuer.totalIssued(), 1);
    }

    function testCannotRevokeNonIssuedPassports() public {
        startIssuance();
        address citiz3n = address(0xDAD);

        evm.expectRevert(sig.selector("PassportNotIssued()"));
        issuer.revoke(citiz3n);
    }

    function testCannotRevokeEligibleAccount() public {
        startIssuance();
        (address citiz3n, uint256 privateKey) = getFilledAccount(0xDAD);
        address guardian = address(0xDEAD);

        claimPassportWith(citiz3n, privateKey);

        // Citizen veToken balance goes under claim requirements but over revoke threshold
        veToken.setBalance(citiz3n, (CLAIM_REQUIRED_BALANCE * 9) / 10);

        evm.prank(guardian);
        evm.expectRevert(sig.selector("NonRevocable()"));
        issuer.revoke(citiz3n);
    }

    function testAdminCanAlwaysRevoke() public {
        startIssuance();
        (address citiz3n, uint256 privateKey) = getFilledAccount(0xDAD);
        claimPassportWith(citiz3n, privateKey);

        evm.expectRevert(sig.selector("NonRevocable()"));
        issuer.revoke(citiz3n);

        issuer.adminRevoke(citiz3n);
    }
}
