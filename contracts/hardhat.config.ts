import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { dec } from "./utils/deploymentHelpers";
import devDeployment from "./deployments/dev.json";

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
    const [deployer] = await hre.ethers.getSigners();

    const NATION = await hre.ethers.getContractAt("ERC20Mock", devDeployment.nation);

    const airdropAllowance = await NATION.allowance(deployer.address, devDeployment.airdropDistributor);
    console.log(airdropAllowance);
});

task("setupRewards", "Set rewards").setAction(async (taskArgs, hre) => {
    const rewardsAmount = process.env.REWARDS_AMOUNT || hre.ethers.BigNumber.from(dec(1337, 18));
    const rewardsStart = await hre.ethers.provider.getBlockNumber();
    const rewardsEnd = rewardsStart + 314;

    const NATION = await hre.ethers.getContractAt("ERC20Mock", devDeployment.nation);
    const rewardsDistributor = await hre.ethers.getContractAt("LiquidityRewardsDistributor", devDeployment.rewardsDistributor);

    const rewardsDistributorBalance = await NATION.balanceOf(rewardsDistributor.address);
    if (rewardsDistributorBalance < rewardsAmount) {
        await NATION.transfer(rewardsDistributor.address, rewardsAmount);
    }
    await rewardsDistributor.setRewards(rewardsAmount, rewardsStart, rewardsEnd);
    await NATION.transfer(rewardsDistributor.address, rewardsAmount);
    
    const totalRewards = await rewardsDistributor.totalRewards();
    console.log(`Address: ${rewardsDistributor.address}`);
    console.log(`Total Rewards: ${totalRewards} End: ${rewardsEnd}`);
});

task("setupAirdrop", "Set rewards").setAction(async (taskArgs, hre) => {
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
