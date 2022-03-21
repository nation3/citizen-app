// SPDX-License-Identifier: UNLICENSED
pragma solidity = 0.8.10;
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

error NotAuthorized();
error InvalidFrom();
error InvalidRecipient();
error UnsafeRecipient();
error AlreadyMinted();
error NotMinted();
error TokenOwnerMismatch();

/// @notice ERC721 membership contract
/// @author Nation3 (https://github.com/nation3)
/// Adapted from https://github.com/Rari-Capital/solmate/blob/main/src/tokens/ERC721.sol
/// @dev Approval and Transfer are limited to Owner (issuer) contract
contract PassportNFT is Ownable {

    using Strings for uint256;

    event Transfer(address indexed from, address indexed to, uint256 indexed id);
    event Approval(address indexed owner, address indexed spender, uint256 indexed id);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    string public name = "Nation3 Passport";
    string public symbol = "N3PASS";
    string public baseURI;
    uint256 public totalSupply;

    uint256 private _idTracker;

    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public byOwner;
    mapping(uint256 => address) public ownerOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    
    function approve(address spender, uint256 id) public virtual onlyOwner {
        address owner = ownerOf[id];

        if (msg.sender != owner && isApprovedForAll[owner][msg.sender] == false) {
            revert NotAuthorized();
        }

        getApproved[id] = spender;

        emit Approval(owner, spender, id);
    }

    function setApprovalForAll(address operator, bool approved) public virtual onlyOwner {
        isApprovedForAll[msg.sender][operator] = approved;

        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public virtual onlyOwner {
        if(from != ownerOf[id]) revert InvalidFrom();
        if(to == address(0)) revert InvalidRecipient();
        if(
            msg.sender != from
            && isApprovedForAll[from][msg.sender] == false
            && msg.sender != getApproved[id]
        ) revert NotAuthorized();

        // Underflow of the sender's balance is impossible because we check for
        // ownership above and the recipient's balance can't realistically overflow.
        unchecked {
            balanceOf[from]--;

            balanceOf[to]++;
        }

        ownerOf[id] = to;

        delete getApproved[id];

        emit Transfer(from, to, id);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id
    ) public virtual onlyOwner {
        transferFrom(from, to, id);

        if (
            to.code.length != 0 &&
                ERC721TokenReceiver(to).onERC721Received(msg.sender, from, id, "") !=
                ERC721TokenReceiver.onERC721Received.selector
        ) revert UnsafeRecipient();
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        bytes memory data
    ) public virtual onlyOwner {
        transferFrom(from, to, id);

        if (
            to.code.length != 0 &&
                ERC721TokenReceiver(to).onERC721Received(msg.sender, from, id, data) !=
                ERC721TokenReceiver.onERC721Received.selector
        ) revert UnsafeRecipient();
    }
 
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function tokenURI(uint256 tokenId) external view virtual returns (string memory) {
        if (ownerOf[tokenId] == address(0)) revert NotMinted();
        return string(abi.encodePacked(baseURI, "/", tokenId.toString(), ".json"));
    }

    function getNextId() external view virtual returns (uint256) {
        return _idTracker;
    }

    function mint(address to) external virtual onlyOwner {
        _mint(to, _idTracker);
        _idTracker++;
    }

    function burn(uint256 id) external virtual onlyOwner {
        _burn(id);
    }

    function burnFromOwner(address owner) external virtual onlyOwner {
        if (balanceOf[owner] == 0) revert NotMinted();
        uint256 tokenId = byOwner[owner];
        if (owner != ownerOf[tokenId]) revert TokenOwnerMismatch();
        _burn(tokenId);
    }


    /*///////////////////////////////////////////////////////////////
                              ERC165 LOGIC
    //////////////////////////////////////////////////////////////*/

    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return
            interfaceId == 0x01ffc9a7 || // ERC165 Interface ID for ERC165
            interfaceId == 0x80ac58cd || // ERC165 Interface ID for ERC721
            interfaceId == 0x5b5e139f; // ERC165 Interface ID for ERC721Metadata
    }

    /*///////////////////////////////////////////////////////////////
                       INTERNAL MINT/BURN LOGIC
    //////////////////////////////////////////////////////////////*/

    function _mint(address to, uint256 id) internal virtual {
        if (to == address(0)) revert InvalidRecipient();

        if (ownerOf[id] != address(0)) revert AlreadyMinted();

        totalSupply++;

        balanceOf[to] = 1;
        ownerOf[id] = to;
        byOwner[to] = id;

        emit Transfer(address(0), to, id);
    }

    function _burn(uint256 id) internal virtual {
        address owner = ownerOf[id];

        if (owner == address(0)) revert NotMinted();

        totalSupply--;

        delete balanceOf[owner];
        delete ownerOf[id];
        delete byOwner[owner];
        delete getApproved[id];

        emit Transfer(owner, address(0), id);
    }

    /*///////////////////////////////////////////////////////////////
                       INTERNAL SAFE MINT LOGIC
    //////////////////////////////////////////////////////////////*/

    function _safeMint(address to, uint256 id) internal virtual {
        _mint(to, id);

        if (
            to.code.length != 0 &&
                ERC721TokenReceiver(to).onERC721Received(msg.sender, address(0), id, "") !=
                ERC721TokenReceiver.onERC721Received.selector
        ) revert UnsafeRecipient();
    }

    function _safeMint(
        address to,
        uint256 id,
        bytes memory data
    ) internal virtual {
        _mint(to, id);

        if (
            to.code.length != 0 ||
                ERC721TokenReceiver(to).onERC721Received(msg.sender, address(0), id, data) !=
                ERC721TokenReceiver.onERC721Received.selector
        ) revert UnsafeRecipient();
    }
}

/// @notice A generic interface for a contract which properly accepts ERC721 tokens.
/// @author Solmate (https://github.com/Rari-Capital/solmate/blob/main/src/tokens/ERC721.sol)
interface ERC721TokenReceiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 id,
        bytes calldata data
    ) external returns (bytes4);
}
