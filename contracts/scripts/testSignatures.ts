import { ethers } from "ethers";

const main = async () => {
    const ipfsURL = "https://github.com/nation3/test"

    const domain = {
        name: 'Nation3',
        version: '1',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    }

    // The named list of all type definitions
    const types = {
        Message: [
            { name: 'statement', type: 'string' },
            { name: 'termsURL', type: 'string' },
        ],
    }

    const value = {
        statement: 'I agree to the terms outlined here',
        termsURL: ipfsURL
    }

    const typedData = {
        types,
        domain,
        message: value,
    }

    // const hash = ethers.utils._TypedDataEncoder.hash(domain, types, value);

    // console.log(ethers.utils.parseBytes32String(hash))

    const wallet = ethers.Wallet.createRandom();
    const signature = await wallet._signTypedData(domain, types, value);
    const sig = ethers.utils.splitSignature(signature);

    console.log("Address: ", wallet.address);
    console.log("Signature: ", sig);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
