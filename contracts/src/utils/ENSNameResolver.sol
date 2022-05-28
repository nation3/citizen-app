pragma solidity =0.8.10;

interface IDefaultResolver {
    function name(bytes32 node) external view returns (string memory);
}

interface IReverseRegistrar {
    function node(address addr) external view returns (bytes32);

    function defaultResolver() external view returns (IDefaultResolver);
}

library ENSNameResolver {
    function lookupENSName(address _address) public view returns (string memory) {
        // Comment based on the deployment chain
        address ENS_RINKEBY = 0x6F628b68b30Dc3c17f345c9dbBb1E483c2b7aE5c;

        // address NEW_ENS_MAINNET = 0x084b1c3C81545d370f3634392De611CaaBFf8148;
        // address OLD_ENS_MAINNET = 0x9062C0A6Dbd6108336BcBe4593a3D1cE05512069;

        string memory ens = tryLookupENSName(ENS_RINKEBY, _address);

        /*
        string memory ens = tryLookupENSName(NEW_ENS_MAINNET, _address);
        if (bytes(ens).length == 0) {
            ens = tryLookupENSName(OLD_ENS_MAINNET, _address);
        }
        */

        return ens;
    }

    function tryLookupENSName(address _registrar, address _address) public view returns (string memory) {
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
