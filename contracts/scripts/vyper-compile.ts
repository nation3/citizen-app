import fs from "fs";
import { exec } from "child_process";

const INPUT_SCHEMA = {
    "language": "Vyper",
    "sources": {},
    "settings": {
        "optimize": true,
        "outputSelection": {
            "*": ["evm.bytecode", "abi"]
        }
    }
}

// Wrap vyper-json compile on a single script
// Format JSON artifact file to be compatible with ethers
const main = async () => {
    const contractsBaseDir = "src";
    const outputBaseDir = "out";

    const contractName = "VotingEscrow";
    const contractDir = "governance";
    const contractFile = "VotingEscrow.vy";
    const contractFilePath = `${contractsBaseDir}/${contractDir}/${contractFile}`;

    const contractContent = fs.readFileSync(`${process.cwd()}/${contractFilePath}`, { encoding: "utf8" });
    console.log(contractFilePath)

    let inputParams = JSON.parse(JSON.stringify(INPUT_SCHEMA));
    inputParams.sources[contractFilePath] = {"content": contractContent};

    fs.writeFileSync("temp.json", JSON.stringify(inputParams, null, 1));

    const outputDir = `${outputBaseDir}/${contractFile}`;
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true});

    exec(
        ["vyper-json", "temp.json"].join(" "),
        (error, stdout, stderr) => {
            const artifacts = JSON.parse(stdout);
            const contractArtifact = artifacts.contracts[contractFilePath][contractName];
            const outputFile = `${outputDir}/${contractName}.json`;
            const outputArtifact: {abi: Array<any>, bytecode: Object} = { "abi": [], "bytecode": {}};

            outputArtifact.bytecode = contractArtifact.evm.bytecode;
            contractArtifact.abi.map((item: any) => {
                delete item.gas;
                outputArtifact.abi.push(item);
            });

            fs.writeFileSync(outputFile, JSON.stringify(outputArtifact, null, 1));
            fs.unlinkSync("temp.json");
        }
    );

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
