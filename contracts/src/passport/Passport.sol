// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.10;

import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";
import {ERC721} from "@rari-capital/solmate/src/tokens/ERC721.sol";
import {SafeTransferLib} from "@rari-capital/solmate/src/utils/SafeTransferLib.sol";
import {Controlled} from "../utils/Controlled.sol";
import {Renderer} from "./Renderer.sol";

contract Passport is ERC721, Controlled {
        /*///////////////////////////////////////////////////////////////
                               LIBRARIES
    //////////////////////////////////////////////////////////////*/

    using SafeTransferLib for ERC20;

        /*///////////////////////////////////////////////////////////////
                               ERRORS
    //////////////////////////////////////////////////////////////*/

    error NotMinted();
    error NotAuthorized();
    error InvalidFrom();
    error InvalidSigner();

    /*///////////////////////////////////////////////////////////////
                            STORAGE
    //////////////////////////////////////////////////////////////*/

    // @notice On-chain metadata renderer.
    Renderer public renderer;

    /// @dev Tracks the number of tokens minted & not burned.
    uint256 internal _supply;
    /// @dev Tracks the next id to mint.
    uint256 internal _idTracker;

    // @dev Timestamp of each token mint.
    mapping(uint256 => uint256) internal _timestampOf;
    // @dev Authorized signer of each token, it can be different from the owner.
    mapping(uint256 => address) internal _signerOf;

    /*///////////////////////////////////////////////////////////////
                            VIEWS
    //////////////////////////////////////////////////////////////*/

    /// @notice Returns total number of tokens in supply.
    function totalSupply() external view virtual returns (uint256) {
        return _supply;
    }

    /// @notice Gets next id to mint.
    function getNextId() external view virtual returns (uint256) {
        return _idTracker;
    }

    /// @notice Returns the timestamp of the mint of a token.
    /// @param id Token to retrieve timestamp from.
    function timestampOf(uint256 id) public view virtual returns (uint256) {
        if (_ownerOf[id] == address(0)) revert NotMinted();
        return _timestampOf[id];
    }

    /// @notice Returns the authorized signer of a token.
    /// @param id Token to retrieve signer from.
    function signerOf(uint256 id) external view virtual returns (address) {
        if (_ownerOf[id] == address(0)) revert NotMinted();
        return _signerOf[id];
    }

    /// @notice Get encoded metadata from renderer.
    /// @param id Token to retrieve metadata from.
    function tokenURI(uint256 id) public view override returns (string memory) {
        return renderer.render(
            id,
            ownerOf(id),
            timestampOf(id)
        );
    }

    /*///////////////////////////////////////////////////////////////
                           CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @dev Sets name & symbol.
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    /*///////////////////////////////////////////////////////////////
                       USER ACTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Allows the owner of a passport to update the signer.
    function setSigner(uint256 id, address signer) external virtual {
        if (_ownerOf[id] != msg.sender) revert NotAuthorized();
        if (signer == address(0)) revert InvalidSigner();
        _signerOf[id] = signer;
    }

    /*///////////////////////////////////////////////////////////////
                       CONTROLLED ACTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Transfers passport (id) between two addresses.
    /// @dev Contract owner is always allowed to transfer.
    /// @param from Current owner of the token.
    /// @param to Recipient of the token.
    /// @param id Token to transfer.
    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public override onlyController {
        if (from != _ownerOf[id]) revert InvalidFrom();
        if (to == address(0)) revert TargetIsZeroAddress();
        if (
            msg.sender != from &&
            !isApprovedForAll[from][msg.sender] &&
            msg.sender != getApproved[id] &&
            msg.sender != controller()
        ) revert CallerIsNotAuthorized();

        unchecked {
            _balanceOf[from]--;
            _balanceOf[to]++;
        }

        _ownerOf[id] = to;

        delete getApproved[id];

        emit Transfer(from, to, id);
    }

    /// @notice Safe transfers passport (id) between two address.
    /// @param from Curent owner of the token.
    /// @param to Recipient of the token.
    /// @param id Token to transfer.
    function safeTransferFrom(
        address from,
        address to,
        uint256 id
    ) public override onlyController {
        super.safeTransferFrom(from, to, id);
    }

    /// @notice Safe transfers passport (id) between two address.
    /// @param from Curent owner of the token.
    /// @param to Recipient of the token.
    /// @param id Token to transfer.
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        bytes calldata data
    ) public override onlyController {
        super.safeTransferFrom(from, to, id, data);
    }

    /// @notice Mints a new passport to the recipient.
    /// @param to Token recipient.
    /// @dev Id is auto assigned.
    function mint(address to) external virtual onlyController returns (uint256 tokenId) {
        _mint(to, _idTracker);
        tokenId = _idTracker;

        // Realistically won't overflow;
        unchecked {
            _timestampOf[tokenId] = block.timestamp;
            _signerOf[tokenId] = to;
            _idTracker++;
            _supply++;
        }
    }

    /// @notice Mints a new passport to the recipient.
    /// @param to Token recipient.
    /// @dev Id is auto assigned.
    function safeMint(address to) external virtual onlyController returns (uint256 tokenId) {
        _safeMint(to, _idTracker);
        tokenId = _idTracker;

        // Realistically won't overflow;
        unchecked {
            _timestampOf[tokenId] = block.timestamp;
            _signerOf[tokenId] = to;
            _idTracker++;
            _supply++;
        }
    }

    /// @notice Burns the specified token.
    /// @param id Token to burn.
    function burn(uint256 id) external virtual onlyController {
        _burn(id);

        // Would have reverted before if the token wasnt minted
        unchecked {
            delete _timestampOf[id];
            delete _signerOf[id];
            _supply--;
        }
    }

    /*///////////////////////////////////////////////////////////////
                       ADMIN ACTIONS
    //////////////////////////////////////////////////////////////*/

   /// @notice Allow the owner to update the renderer contract
   /// @param _renderer New renderer address
   function setRenderer(Renderer _renderer) external virtual onlyOwner {
       renderer = _renderer;
   }

    /// @notice Allow the owner to withdraw any ERC20 sent to the contract.
    /// @param token Token to withdraw.
    /// @param amount Amount of tokens to withdraw.
    /// @param to Recipient address of the tokens.
    function recoverTokens(
        ERC20 token,
        uint256 amount,
        address to
    ) external virtual onlyOwner {
        token.safeTransfer(to, amount);
    }
}
