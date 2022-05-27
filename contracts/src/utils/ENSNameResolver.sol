pragma solidity =0.8.10;

interface IDefaultResolver {
    function name(bytes32 node) external view returns (string memory);
}

interface IReverseRegistrar {
    function node(address addr) external view returns (bytes32);

    function defaultResolver() external view returns (IDefaultResolver);
}

library ENSNameResolver {

    address public constant NEW_ENS = 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e;
    address public constant OLD_ENS_MAINNET = 0x314159265dD8dbb310642f98f50C066173C1259b;

    function lookupENSName(address account) public view returns(string memory) {
        string memory ens = tryLookupENSName(NEW_ENS, account);

        if (bytes(ens).length == 0) {
            ens = tryLookupENSName(OLD_ENS_MAINNET, account);
        }

        return ens;
    }

    function tryLookupENSName(address _registrar, address _address) internal view returns (string memory) {
        uint32 size;
        assembly {
            size := extcodesize(_registrar)
        }
        if (size == 0) {
            return "";
        }
        IReverseRegistrar ensReverseRegistrar = IReverseRegistrar(_registrar);
        bytes32 node = ensReverseRegistrar.node(_address);
        return ensReverseRegistrar.defaultResolver().name(node);
    }
}