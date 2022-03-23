// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import {DSTest} from "./utils/test.sol";
import {PassportNFT} from "../Passport.sol";

contract PassportTest is DSTest {
    PassportNFT pass;

    function setUp() public {
        pass = new PassportNFT("Passport", "PASS");
    }

    function testMetadata() public {
        assertEq(pass.name(), "Passport");
        assertEq(pass.symbol(), "PASS");
    }
}
