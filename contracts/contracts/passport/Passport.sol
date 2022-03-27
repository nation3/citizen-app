// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.10;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "../utils/ERC721Extended.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @notice ERC721 membership contract.
/// @author Nation3 (https://github.com/nation3).
/// @dev Mint, burn & transfers are restricted to owner (issuer contract).
contract PassportNFT is ERC721, Ownable {
    /*///////////////////////////////////////////////////////////////
                               LIBRARIES
    //////////////////////////////////////////////////////////////*/

    using SafeERC20 for IERC20;

    /*///////////////////////////////////////////////////////////////
                            STORAGE
    //////////////////////////////////////////////////////////////*/

    /// @dev Tracks the number of tokens minted & not burned
    uint256 internal _supply;
    /// @dev Tracks the next id to mint
    uint256 internal _idTracker;

    /*///////////////////////////////////////////////////////////////
                            VIEWS
    //////////////////////////////////////////////////////////////*/

    /// @notice Returns total number of tokens in supply
    function totalSupply() public view override returns (uint256) {
        return _supply;
    }

    /// @notice Get next id to mint
    function getNextId() external view virtual returns (uint256) {
        return _idTracker;
    }

    /*///////////////////////////////////////////////////////////////
                           CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /// @dev Sets name & symbol.
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    /*///////////////////////////////////////////////////////////////
                       RESTRICTED ACTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Transfers passport (id) between two address restricted to contract owner.
    /// @dev Contract owner is allways allowed to transfer.
    /// @param from Curent owner of the token.
    /// @param to Recipient of the token.
    /// @param id Token to transfer.
    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public override onlyOwner {
        if (from != ownerOf[id]) revert InvalidFrom();
        if (to == address(0)) revert InvalidRecipient();
        if (
            msg.sender != from &&
            isApprovedForAll[from][msg.sender] == false &&
            msg.sender != getApproved[id] &&
            msg.sender != owner()
        ) revert NotAuthorized();

        unchecked {
            balanceOf[from]--;
            balanceOf[to]++;
        }

        ownerOf[id] = to;

        delete getApproved[id];

        emit Transfer(from, to, id);
    }

    /// @notice Safe transfers passport (id) between two address restricted to contract owner.
    /// @param from Curent owner of the token.
    /// @param to Recipient of the token.
    /// @param id Token to transfer.
    function safeTransferFrom(
        address from,
        address to,
        uint256 id
    ) public override onlyOwner {
        super.safeTransferFrom(from, to, id);
    }

    /// @notice Safe transfers passport (id) between two address restricted to contract owner.
    /// @param from Curent owner of the token.
    /// @param to Recipient of the token.
    /// @param id Token to transfer.
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        bytes memory data
    ) public override onlyOwner {
        super.safeTransferFrom(from, to, id, data);
    }

    /// @notice Mints a new passport to the recipient.
    /// @param to Token recipient.
    /// @dev Id is auto assigned.
    function mint(address to) external virtual onlyOwner {
        _mint(to, _idTracker);

        // Realistically won't overflow;
        unchecked {
            _idTracker++;
            _supply++;
        }
    }

    /// @notice Mints a new passport to the recipient.
    /// @param to Token recipient.
    /// @dev Id is auto assigned.
    function safeMint(address to) external virtual onlyOwner {
        _safeMint(to, _idTracker);

        _idTracker++;
        _supply++;
    }

    /// @notice Burns the specified token.
    /// @param id Token to burn.
    function burn(uint256 id) external virtual onlyOwner {
        _burn(id);

        // Would have reverted before if the token wasnt minted
        unchecked {
            _supply--;
        }
    }

    /// @notice Allow the owner to withdraw any ERC20 sent to the contract.
    /// @param token Token to withdraw.
    /// @param amount Amount of tokens to withdraw.
    /// @param to Recipient address of the tokens.
    function recoverTokens(
        IERC20 token,
        uint256 amount,
        address to
    ) external virtual onlyOwner {
        token.safeTransfer(to, amount);
    }
}
