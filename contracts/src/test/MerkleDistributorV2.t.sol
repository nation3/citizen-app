// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.10;

import {DSTest} from "./utils/test.sol";
import {Hevm} from "./utils/Hevm.sol";
import {Signatures as sig} from "./utils/Signatures.sol";
import {MockERC20} from "./utils/mocks/MockERC20.sol";
import {MerkleDistributorV2} from "../distributors/MerkleDistributorV2.sol";

contract MerkleDistributorTest is DSTest {
    Hevm evm = Hevm(HEVM_ADDRESS);

    MockERC20 token;
    MerkleDistributorV2 distributor;

    uint256 public constant tokenSupply = 42069 * 1e21;
    uint256 public constant airdropAllowance = 1337 * 1e21;
    bytes32 public constant merkleRoot = 0x5cdea970c9f23ca3ad7c3d706650a7d1a1cf0269632e0059c9dcfcb544d3a5c8;

    function setUp() public {
        token = new MockERC20("Nation3 Network Token", "NATION", tokenSupply);
        distributor = new MerkleDistributorV2();
        distributor.setUp(address(this), token, merkleRoot);
        // Set allowance for the airdrop
        token.approve(address(distributor), airdropAllowance);
    }

    function getValidClaimer()
        public
        pure
        returns (
            uint256 index,
            address account,
            uint256 amount,
            bytes32[] memory proofs
        )
    {
        index = 19;
        account = 0xBC61c73CFc191321DA837def848784c002279a01;
        amount = 5;

        proofs = new bytes32[](3);
        proofs[0] = 0xebe77a4d8819f67553d4563538abf6fd6417c99b9b85486d47458fb8e42fbdd6;
        proofs[1] = 0xc1e42302dfdf0b0d2c52bc4f0fdbb35f8b4d02b1a276fe895d77b4116d639f05;
        proofs[2] = 0x5221b4a135c004944c72c1a4aa7cd3f203283a3a0822fabd5dc8efbab6689980;
    }

    function testInit() public {
        assertEq(distributor.sender(), address(this));
        assertEq(address(distributor.token()), address(token));
        assertEq(distributor.merkleRoot(), merkleRoot);
    }

    function testClaim() public {
        (uint256 index, address account, uint256 amount, bytes32[] memory proofs) = getValidClaimer();

        distributor.claim(index, account, amount, proofs);

        // Check that the tokens has been sent from sender and the allowance adjust properly
        uint256 diffSenderBalance = tokenSupply - token.balanceOf(address(this));
        uint256 diffDistributorAllowance = airdropAllowance - token.allowance(address(this), address(distributor));
        assertEq(token.balanceOf(account), amount);
        assertEq(diffSenderBalance, amount);
        assertEq(diffDistributorAllowance, amount);

        // Trying to claim again must revert
        evm.expectRevert(sig.selector("AlreadyClaimed()"));
        distributor.claim(index, account, amount, proofs);
    }

    function testClaimInvalidProofs() public {
        (uint256 index, address account, uint256 amount, bytes32[] memory proofs) = getValidClaimer();

        // Invalid proofs
        bytes32[] memory badProofs = new bytes32[](2);
        badProofs[0] = proofs[1];
        badProofs[1] = proofs[0];

        evm.expectRevert(sig.selector("InvalidProof()"));
        distributor.claim(index, account, amount, badProofs);
    }

    function testClaimInvalidAccount() public {
        (uint256 index, , uint256 amount, bytes32[] memory proofs) = getValidClaimer();

        // Random account
        address badAccount = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

        evm.expectRevert(sig.selector("InvalidProof()"));
        distributor.claim(index, badAccount, amount, proofs);
    }

    function testClaimInvalidAmount() public {
        (uint256 index, address account, , bytes32[] memory proofs) = getValidClaimer();

        // Random amount
        uint256 badAmount = 20;

        evm.expectRevert(sig.selector("InvalidProof()"));
        distributor.claim(index, account, badAmount, proofs);
    }

    function testDropReset() public {
        (uint256 index, address account, uint256 amount, bytes32[] memory proofs) = getValidClaimer();

        distributor.claim(index, account, amount, proofs);

        distributor.setUp(address(this), token, merkleRoot);

        distributor.claim(index, account, amount, proofs);
    }
}
