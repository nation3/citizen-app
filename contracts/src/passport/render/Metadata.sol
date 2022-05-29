// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.10;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {DateTime, Date} from "../../utils/DateTime.sol";

library Metadata {
    function getMetadataJson(
        uint256 tokenId,
        address owner,
        uint256 timestamp,
        string memory imageData
    ) public pure returns (string memory) {
        string memory attributes = renderAttributes(tokenId, owner, timestamp);
        return string(abi.encodePacked(
            '{"name": "',
            renderName(tokenId),
            '", "image": "data:image/svg+xml;base64,',
            imageData,
            '","attributes":[',
            attributes,
            "]}"
        ));
    }

    function renderName(
        uint256 id
    ) public pure returns (string memory) {
        return string(abi.encodePacked("Nation3 Genesis Passport #", Strings.toString(id)));
    }

    function renderAttributes(
        uint256 id,
        address owner,
        uint256 timestamp
    ) public pure returns (string memory) {
        Date memory ts = DateTime.timestampToDateTime(timestamp);

        return
            string(abi.encodePacked(
                attributeString("Passport Holder", Strings.toHexString(uint256(uint160(owner)))),
                ",",
                attributeString("Passport Number", Strings.toString(id)),
                ",",
                attributeString(
                    "Issue Date",
                    string(abi.encodePacked(Strings.toString(ts.day),'/',Strings.toString(ts.month),'/',Strings.toString(ts.year)))
                )
            ));
    }

    function attributeString(string memory _name, string memory _value)
        public
        pure
        returns (string memory)
    {
        return
            string(abi.encodePacked(
                "{",
                kv("trait_type", string(abi.encodePacked('"', _name, '"'))),
                ",",
                kv("value", string(abi.encodePacked('"', _value, '"'))),
                "}"
            ));
    }

    function kv(string memory _key, string memory _value)
        public
        pure
        returns (string memory)
    {
        return string(abi.encodePacked('"', _key, '"', ":", _value));
    }
}
