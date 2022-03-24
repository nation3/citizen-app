// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import fs from "fs";
import { dec } from "../utils/deploymentHelpers";

const saveDeployment = (info: object, path: string) => {
    const content = JSON.stringify(info, null, 1);
    return fs.writeFile(path, content, { encoding: "utf-8"}, (err) => { if(err) console.log(err); })
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const WETH_SUPPLY = ethers.BigNumber.from(dec(10000, 18));
  const NATION_SUPPLY = ethers.BigNumber.from(dec(42069, 18));
  const LPTOKEN_SUPPLY = ethers.BigNumber.from(dec(3140, 18));

  const LP_REWARDS = NATION_SUPPLY.mul(3).div(100);
  const LP_REWARDS_DURATION = 300 // Blocks

  const AIRDROP_ROOT = "0xed145aa219b18aa3f2dc56afb2c4e0b148e429ca93b9c5f2c7a29d2101685aee";
  const AIRDROP_AMOUNT = ethers.BigNumber.from(dec(1000, 18));

  const PASS_LOCKING_AMOUNT = ethers.BigNumber.from(dec(10, 18));
  const LOCKING_DURATION = 13 * 3600 * 24 * 365;

  // We get the contract to deploy
  const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
  const MerkleDistributor = await ethers.getContractFactory("MerkleDistributor");
  const LiquidityRewardsDistributor = await ethers.getContractFactory("LiquidityRewardsDistributor");
  const BalancerPoolsMock = await ethers.getContractFactory("BalancerPoolsMock");
  const PassportNFT = await ethers.getContractFactory("PassportNFT");
  const PassportIssuer = await ethers.getContractFactory("PassportIssuer");

  // Deploy tokens
  const NATION = await ERC20Mock.deploy("Nation3 Token", "NATION", NATION_SUPPLY);
  const WETH = await ERC20Mock.deploy("Wrapped Eth", "ETH", WETH_SUPPLY);
  const LpToken = await ERC20Mock.deploy("Balancer ETH/NATION Pair", "ETHNATION", LPTOKEN_SUPPLY);

  await NATION.deployed();
  await WETH.deployed();
  await LpToken.deployed();

  // Deploy distributors
  const balancerPool = await BalancerPoolsMock.deploy();
  const rewardsDistributor = await LiquidityRewardsDistributor.deploy(); 
  const airdropDistributor = await MerkleDistributor.deploy(NATION.address, AIRDROP_ROOT);

  await rewardsDistributor.deployed();
  await airdropDistributor.deployed();
  await balancerPool.deployed();

  // Deploy passport contracts
  const passportNFT = await PassportNFT.deploy("Nation3 Founding Citizen Passport", "GENESIS-PASSPORT");
  const passportIssuer = await PassportIssuer.deploy();

  await passportNFT.deployed();
  await passportIssuer.deployed();

  // Connect contracts
  await balancerPool.setTokens(NATION.address, WETH.address);
  await rewardsDistributor.initialize(NATION.address, LpToken.address);
  await passportIssuer.initialize(NATION.address, passportNFT.address);
  await passportNFT.transferOwnership(passportIssuer.address);

  // Dev setup
  await NATION.transfer(rewardsDistributor.address, LP_REWARDS);
  await NATION.transfer(airdropDistributor.address, AIRDROP_AMOUNT);
  await rewardsDistributor.setRewards(LP_REWARDS, LP_REWARDS_DURATION);
  await passportIssuer.setLockingParams(PASS_LOCKING_AMOUNT, LOCKING_DURATION);

  const deployment = {
      "weth": WETH.address,
      "nation": NATION.address,
      "balancerPair": LpToken.address,
      "balancerPool": balancerPool.address,
      "rewardsDistributor": rewardsDistributor.address,
      "airdropDistributor": airdropDistributor.address,
      "passportNFT": passportNFT.address,
      "passportIssuer": passportIssuer.address,
  }

  console.log(deployment);
  saveDeployment(deployment, "./devDeployment.json")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
