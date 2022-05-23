let config = {
  nationToken: process.env.NEXT_PUBLIC_NATION_ADDRESS,
  veNationToken: process.env.NEXT_PUBLIC_VENATION_ADDRESS,
  veNationRequiredStake: process.env.NEXT_PUBLIC_VENATION_REQUIRED_STAKE,
  veNationRewardsMultiplier:
    process.env.NEXT_PUBLIC_VENATION_REWARDS_MULTIPLIER,
  balancerVault: process.env.NEXT_PUBLIC_BALANCER_VAULT_ADDRESS,
  balancerPoolId: process.env.NEXT_PUBLIC_BALANCER_NATION_ETH_POOL_ID,
  balancerLPToken: process.env.NEXT_PUBLIC_BALANCER_NATION_ETH_POOL_TOKEN,
  lpRewardsContract: process.env.NEXT_PUBLIC_LP_REWARDS_CONTRACT_ADDRESS,
  nationPassportNFT: process.env.NEXT_PUBLIC_PASSPORT_NFT_ADDRESS,
  nationPassportNFTIssuer: process.env.NEXT_PUBLIC_PASSPORT_NFT_ISSUER_ADDRESS,
  nationDropContracts: [
    process.env.NEXT_PUBLIC_NATION_DISTRIBUTOR1_CONTRACT_ADDRESS,
    process.env.NEXT_PUBLIC_NATION_DISTRIBUTOR2_CONTRACT_ADDRESS,
  ],
}

if (process.env.NEXT_PUBLIC_CHAIN !== 'mainnet') {
  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const devDeployments = require(`../../contracts/deployments/${process.env.NEXT_PUBLIC_CHAIN}.json`)
  config = {
    nationToken: devDeployments.nationToken || zeroAddress,
    veNationToken: devDeployments.veNationToken || zeroAddress,
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'string | ... Remove this comment to see the full error message
    veNationRequiredStake: 2,
    // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'string | ... Remove this comment to see the full error message
    veNationRewardsMultiplier: 2.5,
    balancerVault: process.env.NEXT_PUBLIC_BALANCER_VAULT_ADDRESS,
    balancerPoolId: process.env.NEXT_PUBLIC_BALANCER_NATION_ETH_POOL_ID,
    balancerLPToken: devDeployments.balancerLPToken || zeroAddress,
    lpRewardsContract: devDeployments.lpRewardsContract || zeroAddress,
    nationPassportNFT: devDeployments.nationPassportNFT || zeroAddress,
    nationPassportNFTIssuer: devDeployments.nationPassportNFTIssuer || zeroAddress,
    nationDropContracts: devDeployments.nationDropContracts || [zeroAddress],
  }
}

console.log(process.env.NEXT_PUBLIC_CHAIN)
console.log(config)

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
} = config
