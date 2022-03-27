// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {DSTestPlus} from "./utils/DSTestPlus.sol";
import {Hevm} from "./utils/Hevm.sol";
import {PassportNFT} from "../passport/Passport.sol";
import {Signatures as sig} from "./utils/Signatures.sol";
contract PassportTest is DSTestPlus {

    Hevm evm = Hevm(HEVM_ADDRESS);

    PassportNFT pass;

    function setUp() public {
        pass = new PassportNFT("Passport", "PAS3");
    }

    function testMetadata() public {
        assertEq(pass.name(), "Passport");
        assertEq(pass.symbol(), "PAS3");
    }
}
