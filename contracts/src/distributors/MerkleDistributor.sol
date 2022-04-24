// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.10;

import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {BitMaps} from "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import {SafeTransferLib} from "@rari-capital/solmate/src/utils/SafeTransferLib.sol";
import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";

/// @notice Distributes ERC20 tokens based on a Merkle Tree.
/// @dev Adapted from ENS Airdrop (https://github.com/ensdomains/governance/blob/master/contracts/MerkleAirdrop.sol)
/// & Uniswap Merkle distributor (https://github.com/Uniswap/merkle-distributor/blob/master/contracts/MerkleDistributor.sol).
/// @dev Instead of sending the tokens for the airdrop to the contract allow this contract to transfer the tokens from DAO account.
contract MerkleDistributor {
    /*///////////////////////////////////////////////////////////////
                               LIBRARIES
    //////////////////////////////////////////////////////////////*/

    using SafeTransferLib for ERC20;
    using BitMaps for BitMaps.BitMap;

    /*///////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidProof();
    error AlreadyClaimed();

    /*///////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event Claimed(uint256 indexed index, address indexed recipient, uint256 amount);

    /*///////////////////////////////////////////////////////////////
                        INMUTABLES / CONSTANTS
    //////////////////////////////////////////////////////////////*/

    address public immutable sender;
    ERC20 public immutable token;
    bytes32 public immutable merkleRoot;

    /*///////////////////////////////////////////////////////////////
                                 STORAGE
    //////////////////////////////////////////////////////////////*/

    /// @dev This is a packed array of booleans to signal that a leaf has been claimed.
    BitMaps.BitMap private claimed;

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @dev Set token contract, tokens sender and merkle tree's root.
    /// @param _sender The account to send airdrop tokens from.
    /// @param _token The token to airdrop.
    /// @param _merkleRoot The root of the merkle tree.
    constructor(
        address _sender,
        ERC20 _token,
        bytes32 _merkleRoot
    ) {
        sender = _sender;
        token = _token;
        merkleRoot = _merkleRoot;
    }

    /*///////////////////////////////////////////////////////////////
                                USER ACTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Claims tokens for a recipient if the proofs are valid.
    /// @param index The index into the merkle tree.
    /// @param recipient The account of the claim being made.
    /// @param merkleProof The merkle proof proving the claim is valid.
    function claim(
        uint256 index,
        address recipient,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external {
        if (isClaimed(index)) revert AlreadyClaimed();

        // Verify the merkle proof.
        bytes32 leaf = keccak256(abi.encodePacked(index, recipient, amount));
        if (!MerkleProof.verify(merkleProof, merkleRoot, leaf)) revert InvalidProof();

        // Mark it claimed and send the tokens.
        claimed.set(index);
        token.safeTransferFrom(sender, recipient, amount);

        emit Claimed(index, recipient, amount);
    }

    /// @notice Check if the claim at the given index has already been made.
    /// @param index The index into the merkle tree.
    function isClaimed(uint256 index) public view returns (bool) {
        return claimed.get(index);
    }
}
