import PassportNFT from '../abis/Passport.json'
import PassportIssuer from '../abis/PassportIssuer.json'
import { nationPassportNFT, nationPassportNFTIssuer } from './config'
import { useContractRead, useContractWrite } from './use-wagmi'

const nftContractParams = {
  addressOrName: nationPassportNFT,
  contractInterface: PassportNFT.abi,
}

const nftIssuerContractParams = {
  addressOrName: nationPassportNFTIssuer,
  contractInterface: PassportIssuer.abi,
}

export function useHasPassport(address: any) {
  return useContractRead(
    nftIssuerContractParams,
    'hasPassport',
    {
      args: [address],
      watch: true,
      enable: address,
    },
    false
  )
}

export function useClaimPassport() {
  return useContractWrite(
    {
      addressOrName: nationPassportNFTIssuer,
      contractInterface: PassportIssuer.abi,
    },
    'claim',
    {}
  )
}

export function usePassport(address: any) {
  const { data: id, isLoading: loadingID } = useContractRead(
    nftIssuerContractParams,
    'passportId',
    { args: [address], enable: address }
  )
  const { data: timestamp, isLoading: loadingTimestamp } = useContractRead(
    nftContractParams,
    'getNextId',
    { args: [id], enable: id }
  )
  console.log(`Passport ID ${id}`)
  console.log(`Passport timestamp ${timestamp}`)
  return { data: { id, timestamp }, isLoading: loadingID && loadingTimestamp }
}
