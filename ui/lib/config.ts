const zeroAddress = '0x0000000000000000000000000000000000000000'

interface DeploymentConfig {
  nationToken: string,
  veNationToken: string,
  balancerVault: string,
  balancerPoolId: string,
  balancerLPToken: string,
  lpRewardsContract: string,
  nationPassportNFT: string,
  nationPassportNFTIssuer: string,
  nationPassportAgreementStatement: string,
  nationPassportAgreementURI: string,
  nationPassportRequiredBalance: string,
  nationPassportRevokeUnderBalance: string,
}

interface Config {
  nationToken: string,
  veNationToken: string,
  veNationRewardsMultiplier: number,
  balancerDomain: string,
  balancerVault: string,
  balancerPoolId: string,
  balancerLPToken: string,
  lpRewardsContract: string,
  mobilePassportDomain: string,
  nationPassportNFT: string,
  nationPassportNFTIssuer: string,
  nationPassportAgreementStatement: string,
  nationPassportAgreementURI: string,
  nationPassportRequiredBalance: number,
  nationPassportRevokeUnderBalance: number
}

const chain = process.env.NEXT_PUBLIC_CHAIN || "goerli";
const defaultConfig = require(`../../contracts/deployments/${chain}.json`) as DeploymentConfig
const config: Config = {
  nationToken: defaultConfig.nationToken || zeroAddress,
  veNationToken: defaultConfig.veNationToken || zeroAddress,
  veNationRewardsMultiplier: 2.5,
  balancerDomain: chain === 'goerli' ? 'https://goerli.balancer.fi' : 'https://app.balancer.fi',
  balancerVault: defaultConfig.balancerVault || zeroAddress,
  balancerPoolId: defaultConfig.balancerPoolId || zeroAddress,
  balancerLPToken: defaultConfig.balancerLPToken || zeroAddress,
  lpRewardsContract: defaultConfig.lpRewardsContract || zeroAddress,
  mobilePassportDomain: chain === 'goerli' ? 'https://mobile-passport-goerli.vercel.app' : 'https://passports.nation3.org',
  nationPassportNFT: defaultConfig.nationPassportNFT || zeroAddress,
  nationPassportNFTIssuer: defaultConfig.nationPassportNFTIssuer || zeroAddress,
  nationPassportAgreementStatement: defaultConfig.nationPassportAgreementStatement || "",
  nationPassportAgreementURI: defaultConfig.nationPassportAgreementURI || "",
  nationPassportRequiredBalance: Number(defaultConfig.nationPassportRequiredBalance),
  nationPassportRevokeUnderBalance: Number(defaultConfig.nationPassportRevokeUnderBalance)
}

console.log(config)

export const {
  nationToken,
  veNationToken,
  veNationRewardsMultiplier,
  balancerDomain,
  balancerVault,
  balancerPoolId,
  balancerLPToken,
  lpRewardsContract,
  mobilePassportDomain,
  nationPassportNFT,
  nationPassportNFTIssuer,
  nationPassportAgreementStatement,
  nationPassportAgreementURI,
  nationPassportRequiredBalance,
  nationPassportRevokeUnderBalance
} = config

