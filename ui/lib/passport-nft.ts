import { useNft } from 'use-nft'
import PassportIssuer from '../abis/PassportIssuer.json'
import { nationPassportNFT, nationPassportNFTIssuer } from './config'
import { useContractRead, useContractWrite } from './use-wagmi'

const nftIssuerContractParams = {
  addressOrName: nationPassportNFTIssuer,
  contractInterface: PassportIssuer.abi,
}

export function useHasPassport(address: any) {
  return useContractRead(
    nftIssuerContractParams,
    'passportStatus',
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
    { args: [address], enable: address },
    false
  )
  console.log(`Passport ID ${id}`)
  const { loading, nft } = useNft(nationPassportNFT || '', id)
  return { data: { id, nft }, isLoading: loadingID || loading }
}
