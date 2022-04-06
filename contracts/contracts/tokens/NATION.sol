// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.10;

import {ERC20} from "./ERC20/ERC20.sol";
import {Controlled} from "../utils/Controlled.sol";

/// @notice Nation3 ERC20 token.
/// @author Nation3 (https://github.com/nation3).
/// @dev Mintable by controller.
contract NATION is ERC20, Controlled {
    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 supply
    ) ERC20(_name, _symbol, 18) {
        _mint(msg.sender, supply);
    }

    /*//////////////////////////////////////////////////////////////
                            CONTROLLER ACTIONS
    //////////////////////////////////////////////////////////////*/

    function mint(address to, uint256 amount) external onlyController {
        _mint(to, amount);
    }
}
