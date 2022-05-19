// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.10;

contract Renderer {
    function render(
        uint256 tokenId,
        address owner,
        uint256 timestamp
    ) public pure virtual returns (string memory tokenURI) {
        tokenURI = "TODO";
    }
}
