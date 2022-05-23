// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";
import {SafeTransferLib} from "@rari-capital/solmate/src/utils/SafeTransferLib.sol";
import {IVotingEscrow} from "../governance/IVotingEscrow.sol";
import {Passport} from "./Passport.sol";

/// @notice Issues membership tokens when locking ERC20 tokens
/// @author Nation3 (https://github.com/nation3)
/// @dev Only issues new passports to not already issued accounts
contract PassportIssuer is Initializable, Ownable {
    /*///////////////////////////////////////////////////////////////
                               LIBRARIES
    //////////////////////////////////////////////////////////////*/

    using SafeTransferLib for ERC20;
    using SafeTransferLib for IVotingEscrow;

    /*///////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error NotEligible();
    error StillEligible();
    error InvalidSignature();
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
    Passport public passToken;

    /// @notice Status of the passport issance
    bool public enabled;
    /// @notice % of minLockedBalance under which a passport is revocable (base 100)
    uint8 public revokeUnderRatio;

    /// @notice Agreement statement to sign before claim
    string public statement;
    /// @notice Limit of passports to issue
    uint256 public maxIssuances;
    /// @notice Number of passports issued
    uint256 public totalIssued;
    /// @notice Total Amount of tokens locked
    uint256 public minLockedBalance;

    /// @dev Domain separator hash on initialization
    bytes32 internal INITIAL_DOMAIN_SEPARATOR;

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
    function initialize(IVotingEscrow _veToken, Passport _passToken) public initializer {
        veToken = _veToken;
        passToken = _passToken;
        INITIAL_DOMAIN_SEPARATOR = computeDomainSeparator();
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
    function setParams(
        uint256 supply,
        uint256 _minLockedBalance,
        uint8 _revokeUnderRatio
    ) public virtual onlyOwner {
        maxIssuances = supply;
        minLockedBalance = _minLockedBalance;
        revokeUnderRatio = _revokeUnderRatio;
    }

    /// @notice Updates issuance status.
    /// @dev Can be used by the owner to halt the issuance of new passports.
    function setEnabled(bool status) public virtual onlyOwner {
        enabled = status;
    }

    function setStatement(string memory _statement) public virtual onlyOwner {
        statement = _statement;
    }

    /// @notice Allows the owner to withdraw any ERC20 sent to the contract.
    /// @param token Token to withdraw.
    /// @param to Recipient address of the tokens.
    function recoverTokens(ERC20 token, address to) external virtual onlyOwner returns (uint256 amount) {
        amount = token.balanceOf(address(this));
        token.safeTransfer(to, amount);
    }

    /// @notice Allows the owner to remove the passport of any account
    function adminRevoke(address account) public virtual onlyOwner {
        _withdraw(account);
    }

    /*///////////////////////////////////////////////////////////////
                                USER ACTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Issues a new passport token
    function claim(uint8 v, bytes32 r, bytes32 s) public virtual isEnabled {
        if (totalIssued >= maxIssuances) revert IssuancesLimitReached();
        if (hasPassport(msg.sender)) revert PassportAlreadyIssued();
        if (veToken.balanceOf(msg.sender) < minLockedBalance) revert NotEligible();

        _issue(msg.sender);
    }

    function domainSeparator() public view virtual returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract"),
                    keccak256("Nation3"),
                    keccak256("1"),
                    // block.chainid,
                    // address(this)
                    1,
                    address(0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC)
                )
            );
    }

    /// @notice Issues a new passport token with signature validation
    function signedClaim(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual isEnabled {
        if (totalIssued >= maxIssuances) revert IssuancesLimitReached();
        if (hasPassport(msg.sender)) revert PassportAlreadyIssued();
        if (veToken.balanceOf(msg.sender) < minLockedBalance) revert NotEligible();

        unchecked {
            address signer = ecrecover(
                keccak256(
                    abi.encodePacked(
                        "\x19\x01",
                        domainSeparator(),
                        keccak256(
                            abi.encode(keccak256("Message(string statement, string termsURL)"), statement, termsURL)
                        )
                    )
                ),
                v,
                r,
                s
            );

            if (signer != msg.sender) revert NotEligible();
        }

        _issue(msg.sender);
    }

    /// @notice Removes the passport of the `msg.sender`
    function withdraw() public virtual {
        _withdraw(msg.sender);
    }

    /// @notice Removes the passport of a given account if it's not eligible anymore
    function revoke(address account) public virtual {
        if (veToken.balanceOf(account) >= (minLockedBalance * revokeUnderRatio) / 100) revert StillEligible();
        _withdraw(account);
    }

    /*///////////////////////////////////////////////////////////////
                             EIP-712 LOGIC
    //////////////////////////////////////////////////////////////*/

    /// @notice Returns the domain separator hash for 
    function DOMAIN_SEPARATOR() public view virtual returns (bytes32) {
        return INITIAL_DOMAIN_SEPARATOR != "" ? INITIAL_DOMAIN_SEPARATOR : computeDomainSeparator();
    }

    function verifySignature(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual {
        // Unchecked because the only math done is incrementing
        // the owner's nonce which cannot realistically overflow.
        unchecked {
            address recoveredAddress = ecrecover(
                keccak256(
                    abi.encodePacked(
                        "\x19\x01",
                        DOMAIN_SEPARATOR(),
                        keccak256(
                            abi.encode(
                                keccak256(
                                    "Agreement(string statement)"
                                ),
                                keccak256(abi.encodePacked(statement))
                            )
                        )
                    )
                ),
                v,
                r,
                s
            );

            require(recoveredAddress != address(0) && recoveredAddress == msg.sender, "INVALID_SIGNER");
        }
    }

    function computeDomainSeparator() internal view virtual returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                    keccak256(bytes("PassportIssuer")),
                    keccak256("1"),
                    block.chainid,
                    address(this)
                )
            );
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
