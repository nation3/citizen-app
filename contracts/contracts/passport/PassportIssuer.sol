// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IVotingEscrow} from "../interfaces/IVotingEscrow.sol";
import {PassportNFT} from "./Passport.sol";

/// @notice Issues membership tokens when locking ERC20 tokens
/// @author Nation3 (https://github.com/nation3)
/// @dev Only issues new passports to not already issued accounts
contract PassportIssuer is Initializable, Ownable {
    /*///////////////////////////////////////////////////////////////
                               LIBRARIES
    //////////////////////////////////////////////////////////////*/

    using SafeERC20 for IERC20;
    using SafeERC20 for IVotingEscrow;

    /*///////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error NotEligible();
    error StillEligible();
    error PassportAlreadyIssued();
    error PassportNotIssued();
    error IssuanceIsDisabled();
    error IssuancesLimitReached();

    /*///////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event Issue(address indexed account, uint256 indexed passportId);
    event Withdraw(address indexed amount, uint256 indexed passportId);

    /*///////////////////////////////////////////////////////////////
                                 STORAGE
    //////////////////////////////////////////////////////////////*/

    /// @notice The token used to lock
    IVotingEscrow public veToken;
    /// @notice The token that issues
    PassportNFT public passToken;

    /// @notice Status of the passport issance
    bool public enabled;
    /// @notice Limit of passports to issue
    uint256 public maxIssuances;
    /// @notice Number of passports issued
    uint256 public totalIssued;
    /// @notice Total Amount of tokens locked
    uint256 public minLockedBalance;

    /// @dev Map if account has a passport issued
    mapping(address => uint8) internal _issued;
    /// @dev Passport id issued by account
    mapping(address => uint256) internal _passportId;

    /*///////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /// @notice Requires to be enabled.
    modifier isEnabled() {
        if (!enabled) revert IssuanceIsDisabled();
        _;
    }

    /*///////////////////////////////////////////////////////////////
                               INITIALITION
    //////////////////////////////////////////////////////////////*/

    /// @notice Sets locking token & passport token.
    function initialize(IVotingEscrow _veToken, PassportNFT _passToken) public initializer {
        veToken = _veToken;
        passToken = _passToken;
    }

    /*///////////////////////////////////////////////////////////////
                                  VIEWS
    //////////////////////////////////////////////////////////////*/

    /// @notice Returns account has passport or not
    function hasPassport(address account) public view virtual returns (bool) {
        return _issued[account] == 1;
    }

    /// @notice Returns passport id of a given account
    /// @param account Holder account of a passport
    /// @dev Revert if the account has no passport
    function passportId(address account) public view virtual returns (uint256) {
        if (!hasPassport(account)) revert PassportNotIssued();
        return _passportId[account];
    }

    /*///////////////////////////////////////////////////////////////
                              ADMIN ACTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Sets locking required amount & period for a supply of tokens.
    /// @param supply Max number of tokens that can be issued.
    /// @param _minLockedBalance Minimum amount of voting escrow tokens required for a new issuance.
    function setParams(uint256 supply, uint256 _minLockedBalance) public virtual onlyOwner {
        maxIssuances = supply;
        minLockedBalance = _minLockedBalance;
    }

    /// @notice Updates issuance status.
    /// @dev Can be used by the owner to halt the issuance of new passports.
    function setEnabled(bool status) public virtual onlyOwner {
        enabled = status;
    }

    /// @notice Allow the owner to withdraw any ERC20 sent to the contract.
    /// @param token Token to withdraw.
    /// @param to Recipient address of the tokens.
    function recoverTokens(IERC20 token, address to) external virtual onlyOwner returns (uint256 amount) {
        amount = token.balanceOf(address(this));
        token.safeTransfer(to, amount);
    }

    /*///////////////////////////////////////////////////////////////
                                USER ACTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Issues a new passport token
    function claim() public virtual isEnabled {
        if (totalIssued >= maxIssuances) revert IssuancesLimitReached();
        if (hasPassport(msg.sender)) revert PassportAlreadyIssued();
        if (veToken.balanceOf(msg.sender) < minLockedBalance) revert NotEligible();

        _issue(msg.sender);
    }

    /// @notice Removes the passport of the `msg.sender`
    function withdraw() public virtual {
        _withdraw(msg.sender);
    }

    /// @notice Removes the passport of a given account if it's not eligible anymore
    function revoke(address account) public virtual {
        if (veToken.balanceOf(account) >= minLockedBalance) revert StillEligible();
        _withdraw(account);
    }

    /*///////////////////////////////////////////////////////////////
                             INTERNAL LOGIC
    //////////////////////////////////////////////////////////////*/

    function _issue(address recipient) internal virtual {
        // Mint a new passport to the recipient account
        uint256 tokenId = passToken.safeMint(recipient);

        // Realistically won't overflow;
        unchecked {
            totalIssued++;
        }

        _issued[recipient] = 1;
        _passportId[recipient] = tokenId;

        emit Issue(recipient, tokenId);
    }

    /// @dev Burns the passport token of the account & transfer back the locked tokens.
    /// @param account Address of the account to withdraw the passport from.
    function _withdraw(address account) internal virtual {
        uint256 tokenId = passportId(account);

        // Burn passport
        passToken.burn(tokenId);

        delete _issued[account];
        delete _passportId[account];

        emit Withdraw(account, tokenId);
    }
}
