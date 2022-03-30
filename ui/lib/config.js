let config = {
  nationToken: process.env.NEXT_PUBLIC_NATION_ADDRESS,
  veNationToken: process.env.NEXT_PUBLIC_VENATION_ADDRESS,
  veNationRequiredStake: process.env.NEXT_PUBLIC_VENATION_REQUIRED_STAKE,
  balancerVault: process.env.NEXT_PUBLIC_BALANCER_VAULT_ADDRESS,
  balancerPoolId: process.env.NEXT_PUBLIC_BALANCER_NATION_ETH_POOL_ID,
  balancerLPToken: process.env.NEXT_PUBLIC_BALANCER_NATION_ETH_POOL_TOKEN,
  nationRewardsContract:
    process.env.NEXT_PUBLIC_NATION_REWARDS_CONTRACT_ADDRESS,
  nationPassportNFT: process.env.NEXT_PUBLIC_PASSPORT_NFT_ADDRESS,
  nationDropContract:
    process.env.NEXT_PUBLIC_NATION_DISTRIBUTOR_CONTRACT_ADDRESS,
  nationDropAmount: process.env.NEXT_PUBLIC_NATION_DISTRIBUTOR_DROP_AMOUNT,
}

if (process.env.NEXT_PUBLIC_DEV === 'true') {
  const devDeployments = require('../../contracts/deployments/dev.json')
  const devConfig = {
    nationToken: devDeployments.nation,
    veNationToken: devDeployments.veNation,
    veNationRequiredStake: 10,
    balancerVault: devDeployments.balancerPool,
    balancerLPToken: devDeployments.balancerPair,
    nationRewardsContract: devDeployments.rewardsDistributor,
    nationPassportNFT: devDeployments.passportNFT,
    nationPassportNFTIssuer: devDeployments.passportIssuer,
    nationDropContract: devDeployments.airdropDistributor,
  }
  config = { ...config, ...devConfig }
}

console.log(config)

export const {
  nationToken,
  veNationToken,
  veNationRequiredStake,
  balancerVault,
  balancerPoolId,
  balancerLPToken,
  nationRewardsContract,
  nationPassportNFT,
  nationPassportNFTIssuer,
  nationDropContract,
  nationDropAmount,
} = config
