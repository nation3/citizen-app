// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;
import {IVotingEscrow} from "../../../governance/IVotingEscrow.sol";

contract MockVotingEscrow is IVotingEscrow {
    string name;
    string symbol;

    mapping(address => uint256) internal _balance;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    function allowance(address owner, address spender) external view returns (uint256) {}

    function approve(address spender, uint256 amount) external returns (bool) {}

    function totalSupply() external view returns (uint256) {}

    function transfer(address to, uint256 amount) external returns (bool) {}

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {}

    function setBalance(address to, uint256 amount) public {
        _balance[to] = amount;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balance[account];
    }

    function locked(address) external view returns (LockedBalance memory) {}
}


