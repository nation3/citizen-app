// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.10;

import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {BitMaps} from "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import {SafeTransferLib} from "@rari-capital/solmate/src/utils/SafeTransferLib.sol";
import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";
import {Controlled} from "../utils/Controlled.sol";

/// @notice Distributes ERC20 tokens based on a Merkle Tree, can be used for consecutive distributions.
/// @dev Based on MerkleDistributor (https://github.com/nation3/app/blob/main/contracts/src/distributors/MerkleDistributor.sol)
/// @dev Tree & claims can be reset by owner
contract MerkleDistributorV2 is Controlled {
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

    address public sender;
    ERC20 public token;
    bytes32 public merkleRoot;

    /*///////////////////////////////////////////////////////////////
                                 STORAGE
    //////////////////////////////////////////////////////////////*/

    /// @dev This is a mapping of packed arrays of booleans to signal that a leaf has been claimed.
    /// As you can't delete complex structs on solidity you need to select the active bitmap
    mapping(uint16 => BitMaps.BitMap) private claims;
    /// @dev This signal de id of the drop
    /// This contract supports up to 2^16 different drops
    uint16 dropId;

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() {}

    /*///////////////////////////////////////////////////////////////
                             CONTROLLER ACTIONS
    //////////////////////////////////////////////////////////////*/

    /// @dev Set token contract, tokens sender and merkle tree's root.
    /// @param _sender The account to send airdrop tokens from.
    /// @param _token The token to airdrop.
    /// @param _merkleRoot The root of the merkle tree.
    function setUp(
        address _sender,
        ERC20 _token,
        bytes32 _merkleRoot
    ) public onlyController {
        sender = _sender;
        token = _token;
        merkleRoot = _merkleRoot;
        dropId += 1;
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
        claims[dropId].set(index);
        token.safeTransferFrom(sender, recipient, amount);

        emit Claimed(index, recipient, amount);
    }

    /// @notice Check if the claim at the given index has already been made.
    /// @param index The index into the merkle tree.
    function isClaimed(uint256 index) public view returns (bool) {
        return claims[dropId].get(index);
    }
}
