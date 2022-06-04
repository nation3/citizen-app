const zeroAddress = '0x0000000000000000000000000000000000000000'

interface DeploymentConfig {
  nationToken: string;
  veNationToken: string;
  nationDropContracts: string[],
  balancerLPToken: string,
  lpRewardsContract: string,
  nationPassportNFT: string,
  nationPassportNFTIssuer: string
}
interface Config {
  nationToken: string,
  veNationToken: string,
  veNationRequiredStake: number,
  veNationRewardsMultiplier: number,
  balancerVault: string,
  balancerPoolId: string,
  balancerLPToken: string,
  lpRewardsContract: string,
  nationPassportNFT: string,
  nationPassportNFTIssuer: string,
  nationDropContracts: string[],
  nationDropAmount: number,
}

const chain = process.env.NEXT_PUBLIC_CHAIN || "goerli";
const defaultConfig = require(`../../contracts/deployments/${chain}.json`) as DeploymentConfig
const config: Config = {
  nationToken: process.env.NEXT_PUBLIC_NATION_ADDRESS || zeroAddress,
  veNationToken: process.env.NEXT_PUBLIC_VENATION_ADDRESS || zeroAddress,
  veNationRequiredStake: Number(process.env.NEXT_PUBLIC_VENATION_REQUIRED_STAKE) || 2,
  veNationRewardsMultiplier: Number(process.env.NEXT_PUBLIC_VENATION_REWARDS_MULTIPLIER) || 2.5,
  balancerVault: process.env.NEXT_PUBLIC_BALANCER_VAULT_ADDRESS || zeroAddress,
  balancerPoolId: process.env.NEXT_PUBLIC_BALANCER_NATION_ETH_POOL_ID || zeroAddress,
  balancerLPToken: process.env.NEXT_PUBLIC_BALANCER_NATION_ETH_POOL_TOKEN || defaultConfig.balancerLPToken || zeroAddress,
  lpRewardsContract: process.env.NEXT_PUBLIC_LP_REWARDS_CONTRACT_ADDRESS || defaultConfig.lpRewardsContract || zeroAddress,
  nationPassportNFT: process.env.NEXT_PUBLIC_PASSPORT_NFT_ADDRESS || defaultConfig.nationPassportNFT || zeroAddress,
  nationPassportNFTIssuer: process.env.NEXT_PUBLIC_PASSPORT_NFT_ISSUER_ADDRESS || defaultConfig.nationPassportNFTIssuer || zeroAddress,
  nationDropContracts: JSON.parse(process.env.NEXT_PUBLIC_NATION_DISTRIBUTOR_CONTRACT_ADDRESS || "null") || defaultConfig.nationDropContracts || [zeroAddress],
  nationDropAmount: Number(process.env.NEXT_NATION_DROP_AMOUNT) || 1
}

export const {
  nationToken,
  veNationToken,
  veNationRequiredStake,
  veNationRewardsMultiplier,
  balancerVault,
  balancerPoolId,
  balancerLPToken,
  lpRewardsContract,
  nationPassportNFT,
  nationPassportNFTIssuer,
  nationDropContracts,
  nationDropAmount,
} = config
