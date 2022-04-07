// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import fs from "fs";
import { dec } from "../utils/deploymentHelpers";
import { BigNumber } from "ethers";

const saveDeployment = (info: object, path: string) => {
    const content = JSON.stringify(info, null, 1);
    const file = path.split("\\").pop()?.split("/").pop() || "";
    const dir = path.replace(file, "");

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return fs.writeFile(path, content, { encoding: "utf-8"}, (err) => { if(err) console.log(err); })
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const NATION_SUPPLY: BigNumber = ethers.BigNumber.from(dec(42069, 18));
  const LPTOKEN_SUPPLY: BigNumber = ethers.BigNumber.from(dec(3140, 18));

  const LP_REWARDS: BigNumber = NATION_SUPPLY.mul(3).div(100);

  const AIRDROP_ROOT: string = "0xed145aa219b18aa3f2dc56afb2c4e0b148e429ca93b9c5f2c7a29d2101685aee";
  const AIRDROP_AMOUNT: BigNumber = ethers.BigNumber.from(dec(1000, 18));

  const [deployer] = await ethers.getSigners();

  // Get the contracts to deploy
  const ERC20Token = await ethers.getContractFactory("NATION");
  const WrapContract = await ethers.getContractFactory("WETH");
  const VotingEscrow = await ethers.getContractFactory("VotingEscrow");
  const MerkleDistributor = await ethers.getContractFactory("MerkleDistributor");
  const LiquidityRewardsDistributor = await ethers.getContractFactory("LiquidityRewardsDistributor");
  const BalancerPoolsMock = await ethers.getContractFactory("MockBalancerPools");
  const PassportNFT = await ethers.getContractFactory("PassportNFT");
  const PassportIssuer = await ethers.getContractFactory("PassportIssuer");

  // Deploy tokens
  const WETH = await WrapContract.deploy();
  const NATION = await ERC20Token.deploy("Nation3 Token", "NATION", NATION_SUPPLY);
  const LpToken = await ERC20Token.deploy("Balancer ETH/NATION Pair", "ETHNATION", LPTOKEN_SUPPLY);

  await NATION.deployed();
  await WETH.deployed();
  await LpToken.deployed();

  // Deploy VotingEscrow
  const veNATION = await VotingEscrow.deploy(NATION.address, "Voting Escrow Nation3 Token", "veNATION", "v1");
  await veNATION.deployed();

  // Deploy distributors
  const balancerPool = await BalancerPoolsMock.deploy();
  const rewardsDistributor = await LiquidityRewardsDistributor.deploy(); 
  const airdropDistributor = await MerkleDistributor.deploy(deployer.address, NATION.address, AIRDROP_ROOT);

  await rewardsDistributor.deployed();
  await airdropDistributor.deployed();
  await balancerPool.deployed();

  // Deploy passport contracts
  const passportNFT = await PassportNFT.deploy("Nation3 Founding Citizen Passport", "FOUNDERPAS3");
  const passportIssuer = await PassportIssuer.deploy();

  await passportNFT.deployed();
  await passportIssuer.deployed();

  // Connect contracts
  await balancerPool.setTokens(NATION.address, WETH.address);
  await rewardsDistributor.initialize(NATION.address, LpToken.address);
  await passportIssuer.initialize(veNATION.address, passportNFT.address);
  await passportNFT.transferOwnership(passportIssuer.address);

  // Dev setup
  const PASSPORT_MAX_ISSUANCES: number = 100;
  const PASSPORT_MIN_LOCKED_AMOUNT: BigNumber = ethers.BigNumber.from(dec(25, 17));

  await passportIssuer.setParams(PASSPORT_MAX_ISSUANCES, PASSPORT_MIN_LOCKED_AMOUNT);
  await passportIssuer.setEnabled(true);

  await NATION.approve(airdropDistributor.address, AIRDROP_AMOUNT);
  await NATION.transfer(rewardsDistributor.address, LP_REWARDS);

  const LP_REWARDS_START: number = await ethers.provider.getBlockNumber() + 10;
  const LP_REWARDS_END: number = LP_REWARDS_START + 300;

  await rewardsDistributor.setRewards(LP_REWARDS, LP_REWARDS_START, LP_REWARDS_END);

  const deployment = {
      "weth": WETH.address,
      "nation": NATION.address,
      "veNation": veNATION.address,
      "balancerPair": LpToken.address,
      "balancerPool": balancerPool.address,
      "rewardsDistributor": rewardsDistributor.address,
      "airdropDistributor": airdropDistributor.address,
      "passportNFT": passportNFT.address,
      "passportIssuer": passportIssuer.address,
  }

  console.log(deployment);
  saveDeployment(deployment, "./deployments/dev.json")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
