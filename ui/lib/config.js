let config = {
  nationToken: process.env.NEXT_PUBLIC_NATION_ADDRESS,
  veNationToken: process.env.NEXT_PUBLIC_VENATION_ADDRESS,
  veNationRequiredStake: process.env.NEXT_PUBLIC_VENATION_REQUIRED_STAKE,
  veNationRewardsMultiplier:
    process.env.NEXT_PUBLIC_VENATION_REWARDS_MULTIPLIER,
  balancerVault: process.env.NEXT_PUBLIC_BALANCER_VAULT_ADDRESS,
  balancerPoolId: process.env.NEXT_PUBLIC_BALANCER_NATION_ETH_POOL_ID,
  balancerLPToken: process.env.NEXT_PUBLIC_BALANCER_NATION_ETH_POOL_TOKEN,
  nationRewardsContract:
    process.env.NEXT_PUBLIC_NATION_REWARDS_CONTRACT_ADDRESS,
  nationPassportNFT: process.env.NEXT_PUBLIC_PASSPORT_NFT_ADDRESS,
  nationPassportNFTIssuer: process.env.NEXT_PUBLIC_PASSPORT_NFT_ISSUER_ADDRESS,
  nationDropContracts: [
    process.env.NEXT_PUBLIC_NATION_DISTRIBUTOR1_CONTRACT_ADDRESS,
    process.env.NEXT_PUBLIC_NATION_DISTRIBUTOR2_CONTRACT_ADDRESS,
  ],
  nationDropAmount: process.env.NEXT_PUBLIC_NATION_DISTRIBUTOR_DROP_AMOUNT,
}

if (process.env.NEXT_PUBLIC_CHAIN !== 'mainnet') {
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const devDeployments = require(`../../contracts/deployments/${process.env.NEXT_PUBLIC_CHAIN}.json`)
  const devConfig = {
    nationToken: devDeployments.nationToken || zeroAddress,
    veNationToken: devDeployments.veNationToken || zeroAddress,
    veNationRequiredStake: 2,
    veNationRewardsMultiplier: '2.5',
    balancerVault: devDeployments.balancerPool || zeroAddress,
    balancerLPToken: devDeployments.balancerPair || zeroAddress,
    nationRewardsContract: devDeployments.rewardsDistributor || zeroAddress,
    nationPassportNFT: devDeployments.passportNFT || zeroAddress,
    nationPassportNFTIssuer: devDeployments.passportIssuer || zeroAddress,
    nationDropContracts: devDeployments.nationDropContracts || [zeroAddress],
  }
  config = { ...config, ...devConfig }
}

console.log(config)

export const {
  nationToken,
  veNationToken,
  veNationRequiredStake,
  veNationRewardsMultiplier,
  balancerVault,
  balancerPoolId,
  balancerLPToken,
  nationRewardsContract,
  nationPassportNFT,
  nationPassportNFTIssuer,
  nationDropContracts,
  nationDropAmount,
} = config
