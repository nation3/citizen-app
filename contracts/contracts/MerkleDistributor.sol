// SPDX-License-Identifier: UNLICENSED
pragma solidity = 0.8.10;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {BitMaps} from "@openzeppelin/contracts/utils/structs/BitMaps.sol";

error InvalidProof();
error AlreadyClaimed();

/// @notice Distributes ERC20 tokens based on a Merkle Tree
contract MerkleDistributor {

    using SafeERC20 for IERC20;
    using BitMaps for BitMaps.BitMap;

    event Claimed(uint256 indexed index, address indexed account, uint256 amount);

    IERC20 public immutable token;
    bytes32 public immutable merkleRoot;

    // This is a packed array of booleans.
    BitMaps.BitMap private claimed;

    constructor(IERC20 _token, bytes32 _merkleRoot) {
        token = _token;
        merkleRoot = _merkleRoot;
    }

    function isClaimed(uint256 index) public view returns (bool) {
        return claimed.get(index);
    }

    function claim(uint256 index, address account, uint256 amount, bytes32[] calldata merkleProof) external {
        if (isClaimed(index)) revert AlreadyClaimed();

        // Verify the merkle proof.
        bytes32 node = keccak256(abi.encodePacked(index, account, amount));
        if (!MerkleProof.verify(merkleProof, merkleRoot, node)) revert InvalidProof();

        // Mark it claimed and send the tokens.
        claimed.set(index);
        token.safeTransfer(account, amount);

        emit Claimed(index, account, amount);
    }
}
