// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 supply
    ) ERC20(_name, _symbol, 18) {
        _mint(msg.sender, supply);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }
}
