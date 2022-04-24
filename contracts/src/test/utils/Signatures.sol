// SPDX-License-Identifier: UNLICENSED
pragma solidity = 0.8.10;

library Signatures {

    function selector(string memory _func) internal pure returns (bytes4) {
        return bytes4(keccak256(bytes(_func)));
    }
}
