// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

const dec = (val: number, scale: number) => {
    const zerosCount = scale

    const strVal = val.toString()
    const strZeros = ('0').repeat(zerosCount)

    return strVal.concat(strZeros)
  }

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NATION_SUPPLY = ethers.BigNumber.from(dec(42096000, 18));
  const LPTOKEN_SUPPLY = ethers.BigNumber.from(dec(3140, 18));
  const ERC20Token = await ethers.getContractFactory("Token");
  const LiquidityRewardsDistributor = await ethers.getContractFactory("LiquidityRewardsDistributor");

  const NATION = await ERC20Token.deploy("Nation3 Token", "NATION", NATION_SUPPLY);
  const LpToken = await ERC20Token.deploy("Balancer ETH/NATION Pair", "ETHNATION", LPTOKEN_SUPPLY);
  const rewardsDistributor = await LiquidityRewardsDistributor.deploy(); 

  await NATION.deployed();
  await LpToken.deployed();
  await rewardsDistributor.deployed();

  await rewardsDistributor.initialize(NATION.address, LpToken.address);

  const deployment = {
      "nation": NATION.address,
      "balancerPair": NATION.address,
      "rewardsDistributor": rewardsDistributor.address,
  }

  console.log(deployment);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
