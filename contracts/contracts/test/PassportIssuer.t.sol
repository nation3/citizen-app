// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {DSTestPlus} from "./utils/DSTestPlus.sol";
import {Hevm} from "./utils/Hevm.sol";
import {PassportNFT} from "../passport/Passport.sol";
import {PassportIssuer} from "../passport/PassportIssuer.sol";
import {Signatures as sig} from "./utils/Signatures.sol";
import {IVotingEscrow} from "../interfaces/IVotingEscrow.sol";

contract VotingEscrowMock is IVotingEscrow, DSTestPlus {
    string name;
    string symbol;

    mapping(address => uint256) internal _balance;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    function allowance(address owner, address spender) external view override returns (uint256) {}

    function approve(address spender, uint256 amount) external override returns (bool) {}

    function totalSupply() external view override returns (uint256) {}

    function transfer(address to, uint256 amount) external override returns (bool) {}

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external override returns (bool) {}

    function setBalance(address to, uint256 amount) public {
        _balance[to] = amount;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balance[account];
    }

    function locked(address) external view returns (LockedBalance memory) {}
}

contract PassportIssuerTest is DSTestPlus {
    Hevm evm = Hevm(HEVM_ADDRESS);

    PassportNFT passport;
    PassportIssuer issuer;
    VotingEscrowMock veToken;

    uint256 constant MAX_PASSPORT_ISSUANCES = 3;
    uint256 constant MIN_LOCKED_AMOUNT = 10 * 1e18;

    function setUp() public {
        passport = new PassportNFT("Passport", "PAS3");
        veToken = new VotingEscrowMock("Nation3 Voting Escrow Token", "veNATION");
        issuer = new PassportIssuer();

        issuer.initialize(veToken, passport);
        passport.transferControl(address(issuer));
    }

    function startIssuance() public {
        issuer.setParams(MAX_PASSPORT_ISSUANCES, MIN_LOCKED_AMOUNT);
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
