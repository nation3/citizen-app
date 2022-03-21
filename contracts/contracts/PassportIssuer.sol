// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {PassportNFT} from "./Passport.sol";

error IssuanceIsDisabled();
error AlreadyIssued();
error UnfinishedLockingPeriod();

/// @notice Issues new membership tokens on locking
/// @author Nation3 (https://github.com/nation3)
contract PassportIssuer is Initializable, Ownable {
    // TODO: Add events

    using SafeERC20 for IERC20;

    IERC20 public lockToken;
    PassportNFT public passToken;

    uint256 public lockingAmount;
    uint256 public lockingPeriod;
    bool public enabled = true;

    mapping(address => uint256) public lockingBalance;
    mapping(address => uint256) public lockingEndBlock;

    function initialize(
        IERC20 _lockToken,
        PassportNFT _passToken
    ) public initializer {
        lockToken = _lockToken;
        passToken = _passToken;
    }

    modifier isEnabled {
        if (enabled == false) revert IssuanceIsDisabled();
        _;
    }

    function setLockingParams(
        uint256 _lockingAmount,
        uint256 _lockingPeriod
    ) public virtual onlyOwner {
        lockingAmount = _lockingAmount;
        lockingPeriod = _lockingPeriod;
    }

    function setEnabled(bool status) public virtual onlyOwner {
        enabled = status;
    }

    /// @notice Locks a presetted amount of tokens in exchange for a membership token
    function secure() public virtual isEnabled {
        // Each account can apply only once
        if (passToken.balanceOf(msg.sender) != 0) revert AlreadyIssued();
        // Transfer lock tokens from sender
        lockToken.safeTransferFrom(msg.sender, address(this), lockingAmount);
        // Issue the membership token
        _issueMembership(msg.sender);

        lockingBalance[msg.sender] = lockingAmount;
        lockingEndBlock[msg.sender] = block.number + lockingPeriod;
    }

    /// @notice Unlocks the tokens in exchange for the membership token
    function release() public virtual {
        if (block.number <= lockingEndBlock[msg.sender]) revert UnfinishedLockingPeriod();
        _revokeMembership(msg.sender);
        lockToken.safeTransfer(msg.sender, lockingBalance[msg.sender]);

        delete lockingBalance[msg.sender];
        delete lockingEndBlock[msg.sender];
    }

    function migrateIssuance(address to) public virtual onlyOwner {}

    function _issueMembership(address to) internal virtual {
        passToken.mint(to);
    }

    function _revokeMembership(address from) internal virtual {
        passToken.burnFromOwner(from);
    }
}
