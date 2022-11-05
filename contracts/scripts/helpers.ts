import fs from "fs";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config()

let validConfig = true;
if (process.env.RPC_URL === undefined) {
    console.error("Missing RPC_URL");
    validConfig = false;
}
if (process.env.DEPLOYER_PRIVATE_KEY === undefined) {
    console.error("Missing DEPLOYER_PRIVATE_KEY");
    validConfig = false;
}
if (!validConfig) process.exit(1);

console.debug("Try to create provider with RPC_URL: " + process.env.RPC_URL)
export const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

console.debug("Try to create wallet with PRIVATE_KEY: " + process.env.DEPLOYER_PRIVATE_KEY)
export const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY ?? "", provider)

// Deployment helpers
export const dec = (val: number, scale: number) => {
    const zerosCount = scale;

    const strVal = val.toString();
    const strZeros = ('0').repeat(zerosCount);

    return strVal.concat(strZeros);
  }


export const save = (info: object, path: string) => {
    const content = JSON.stringify(info, null, 1);
    const file = path.split("\\").pop()?.split("/").pop() || "";
    const dir = path.replace(file, "");

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return fs.writeFile(path, content, { encoding: "utf-8"}, (err) => { if(err) console.log(err); })
}


