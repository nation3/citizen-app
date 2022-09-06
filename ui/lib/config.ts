const zeroAddress = '0x0000000000000000000000000000000000000000'

interface DeploymentConfig {
  nationToken: string,
  veNationToken: string,
  nationDropContracts: string[],
  balancerVault: string,
  balancerPoolId: string,
  balancerLPToken: string,
  lpRewardsContract: string,
  nationPassportNFT: string,
  nationPassportNFTIssuer: string
  nationPassportAgreementStatement: string,
  nationPassportAgreementURI: string
}

interface Config {
  nationToken: string,
  veNationToken: string,
  veNationRequiredStake: number,
  veNationRewardsMultiplier: number,
  balancerDomain: string,
  balancerVault: string,
  balancerPoolId: string,
  balancerLPToken: string,
  lpRewardsContract: string,
  nationPassportNFT: string,
  nationPassportNFTIssuer: string,
  nationPassportAgreementStatement: string,
  nationPassportAgreementURI: string,
  nationDropContracts: string[],
  nationDropAmount: number,
}

const chain = process.env.NEXT_PUBLIC_CHAIN || "goerli";
const defaultConfig = require(`../../contracts/deployments/${chain}.json`) as DeploymentConfig
const config: Config = {
  nationToken: defaultConfig.nationToken || zeroAddress,
  veNationToken: defaultConfig.veNationToken || zeroAddress,
  veNationRequiredStake: 2,
  veNationRewardsMultiplier: 2.5,
  balancerDomain: chain === 'goerli' ? 'https://goerli.balancer.fi' : 'https://app.balancer.fi',
  balancerVault: defaultConfig.balancerVault || zeroAddress,
  balancerPoolId: defaultConfig.balancerPoolId || zeroAddress,
  balancerLPToken: defaultConfig.balancerLPToken || zeroAddress,
  lpRewardsContract: defaultConfig.lpRewardsContract || zeroAddress,
  nationPassportNFT: defaultConfig.nationPassportNFT || zeroAddress,
  nationPassportNFTIssuer: defaultConfig.nationPassportNFTIssuer || zeroAddress,
  nationPassportAgreementStatement: defaultConfig.nationPassportAgreementStatement || "",
  nationPassportAgreementURI: defaultConfig.nationPassportAgreementURI || "",
  nationDropContracts: defaultConfig.nationDropContracts || [zeroAddress],
  nationDropAmount: 1
}

export const rpcURL = chain === 'goerli' ? 'https://rpc.ankr.com/eth_goerli' : 'https://rpc.ankr.com/eth';

console.log(config)

export const {
  nationToken,
  veNationToken,
  veNationRequiredStake,
  veNationRewardsMultiplier,
  balancerDomain,
  balancerVault,
  balancerPoolId,
  balancerLPToken,
  lpRewardsContract,
  nationPassportNFT,
  nationPassportNFTIssuer,
  nationPassportAgreementStatement,
  nationPassportAgreementURI,
  nationDropContracts,
  nationDropAmount,
} = config

