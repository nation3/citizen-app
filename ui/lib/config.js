let config = {
  nationToken: process.env.NEXT_PUBLIC_NATION_ADDRESS,
  nationRequiredStake: process.env.NEXT_PUBLIC_NATION_REQUIRED_STAKE,
  balancerVault: process.env.NEXT_PUBLIC_BALANCER_VAULT_ADDRESS,
  balancerPoolId: process.env.NEXT_PUBLIC_BALANCER_NATION_ETH_POOL_ID,
  balancerLPToken: process.env.NEXT_PUBLIC_BALANCER_NATION_ETH_POOL_TOKEN,
  nationRewardsContract:
    process.env.NEXT_PUBLIC_BALANCER_NATION_REWARDS_CONTRACT_ADDRESS,
  nationDropContract:
    process.env.NEXT_PUBLIC_BALANCER_NATION_DISTRIBUTOR_CONTRACT_ADDRESS,
  nationPassportNFT: process.env.NEXT_PUBLIC_BALANCER_PASSPORT_NFT_ADDRESS,
}

if (process.env.NEXT_PUBLIC_DEV === 'true') {
  const devDeployments = require('../../contracts/devDeployment.json')
  const devConfig = {
    nationToken: devDeployments.nation,
    balancerLPToken: devDeployments.balancerPair,
    balancerVault: devDeployments.balancerPool,
    nationRewardsContract: devDeployments.rewardsDistributor,
    nationPassportNFT: devDeployments.passportNFT,
    nationPassportNFTIssuer: devDeployments.passportIssuer,
  }
  config = { ...config, ...devConfig }
}

console.log(config)

export const {
  nationToken,
  nationRequiredStake,
  balancerVault,
  balancerPoolId,
  balancerLPToken,
  nationRewardsContract,
  nationDropContract,
  nationPassportNFT,
  nationPassportNFTIssuer,
} = config
