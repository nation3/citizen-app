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
}

interface Config {
  nationToken: string,
  veNationToken: string,
  balancerDomain: string,
  balancerVault: string,
  balancerPoolId: string,
  balancerLPToken: string,
  etherscanDomain: string,
  lpRewardsContract: string,
  mobilePassportDomain: string,
  nationPassportNFT: string,
  nationPassportNFTIssuer: string,
  nationPassportAgreementStatement: string,
  nationPassportAgreementURI: string,
}


const chain = process.env.NEXT_PUBLIC_CHAIN || "goerli";
const defaultConfig = require(`../../contracts/deployments/${chain}.json`) as DeploymentConfig
const config: Config = {
  nationToken: defaultConfig.nationToken || zeroAddress,
  veNationToken: defaultConfig.veNationToken || zeroAddress,
  balancerDomain: chain === 'mainnet' ? 'https://app.balancer.fi/#/ethereum' : `https://app.balancer.fi/#/${chain}`,
  balancerVault: defaultConfig.balancerVault || zeroAddress,
  balancerPoolId: defaultConfig.balancerPoolId || zeroAddress,
  balancerLPToken: defaultConfig.balancerLPToken || zeroAddress,
  etherscanDomain: chain === 'mainnet' ? 'https://etherscan.io' : `https://${chain}.etherscan.io`,
  lpRewardsContract: defaultConfig.lpRewardsContract || zeroAddress,
  mobilePassportDomain: chain === 'mainnet' ? 'https://passports.nation3.org' : `https://mobile-passport-${chain}.vercel.app`,
  nationPassportNFT: defaultConfig.nationPassportNFT || zeroAddress,
  nationPassportNFTIssuer: defaultConfig.nationPassportNFTIssuer || zeroAddress,
  nationPassportAgreementStatement: defaultConfig.nationPassportAgreementStatement || "",
  nationPassportAgreementURI: defaultConfig.nationPassportAgreementURI || "",
}

console.log(config)

export const {
  nationToken,
  veNationToken,
  balancerDomain,
  balancerVault,
  balancerPoolId,
  balancerLPToken,
  etherscanDomain,
  lpRewardsContract,
  mobilePassportDomain,
  nationPassportNFT,
  nationPassportNFTIssuer,
  nationPassportAgreementStatement,
  nationPassportAgreementURI,
} = config

