import NationPassportNFTIssuer from '../abis/NationPassportNFTIssuer.json'
import { nationPassportNFTIssuer } from './config'
import { useContractRead } from './use-wagmi'

/**
 * @title GetClaimRequestBalance
 * @dev function to fetch claimRequiredBalance from the
 * nationPassportNFTIssuer contract
 * @returns data, error
 */
const GetClaimRequestBalance = () => {
  const { data, error } = useContractRead(
    {
      address: nationPassportNFTIssuer,
      abi: NationPassportNFTIssuer.abi,
      watch: true,
    },
    'claimRequiredBalance'
  )

  return { data: parseInt(data) / 10 ** 18, error }
}

export { GetClaimRequestBalance }
