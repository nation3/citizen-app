import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-vyper";
import { dec } from "./utils/deploymentHelpers";
import { BigNumber } from "ethers";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("checkAirdrop", "Check the airdrop contract", async (taskArgs, hre) => {
    const devDeployment = require("./deployments/dev.json");
    const [deployer] = await hre.ethers.getSigners();

    const NATION = await hre.ethers.getContractAt("ERC20Mock", devDeployment.nation);

    const airdropAllowance = await NATION.allowance(deployer.address, devDeployment.airdropDistributor);
    console.log(airdropAllowance);
});

task("setupRewards", "Set rewards").setAction(async (taskArgs, hre) => {
    const devDeployment = require("./deployments/dev.json");
    // const [deployer] = await hre.ethers.getSigners();

    const rewardsAmount: BigNumber = hre.ethers.BigNumber.from(process.env.REWARDS_AMOUNT?.toString() || dec(1337, 18));

    const NATION = await hre.ethers.getContractAt("ERC20Mock", devDeployment.nation);
    const rewardsDistributor = await hre.ethers.getContractAt("LiquidityRewardsDistributor", devDeployment.rewardsDistributor);

    const rewardsDistributorBalance = await NATION.balanceOf(rewardsDistributor.address);
    if (rewardsDistributorBalance < rewardsAmount) {
        await NATION.transfer(rewardsDistributor.address, rewardsAmount);
    }
    const rewardsStart: number = await hre.ethers.provider.getBlockNumber() + 10;
    const rewardsEnd: number = rewardsStart + 300;

    await rewardsDistributor.setRewards(rewardsAmount, rewardsStart, rewardsEnd);
    
    const totalRewards = await rewardsDistributor.totalRewards();
    console.log(`Address: ${rewardsDistributor.address} Balance: ${rewardsDistributorBalance}`);
    console.log(`Total Rewards: ${totalRewards} End: ${rewardsEnd}`);
});

task("setupAirdrop", "Set rewards").setAction(async (taskArgs, hre) => {
  const devDeployment = require("./deployments/dev.json");
  const dropAmount = process.env.DROP_AMOUNT || hre.ethers.BigNumber.from(dec(1337, 18));
  const NATION = await hre.ethers.getContractAt("ERC20Mock", devDeployment.nation);
  const dropDistributor = await hre.ethers.getContractAt("MerkleDistributor", devDeployment.airdropDistributor);

  await NATION.approve(dropDistributor.address, dropAmount);
  
  console.log(`Address: ${dropDistributor.address}`);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.10",
  vyper: {
      version: "0.2.4",
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hardhat: {
      chainId: 1337,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
