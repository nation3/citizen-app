import { useState, useEffect } from 'react'
import { NftProvider, useNft } from 'use-nft'
import { nationPassportNFT, nationPassportNFTIssuer } from '../lib/config'
import PassportIssuer from '../abis/PassportIssuer.json'
import PassportNFT from '../abis/PassportNFT.json'
import { useContractRead, useContractWrite } from './use-wagmi'

const nftContractParams = {
  addressOrName: nationPassportNFT,
  contractInterface: PassportNFT.abi,
}

const nftIssuerContractParams = {
  addressOrName: nationPassportNFTIssuer,
  contractInterface: PassportIssuer.abi,
}

export function useHasPassport(address) {
  const [hasPassport, setHasPassport] = useState(false)
  const { data, isLoading, error } = useContractRead(
    nftContractParams,
    'balanceOf',
    {
      args: [address],
      watch: true,
      enable: address,
    }
  )
  useEffect(() => {
    setHasPassport(data && data.gt(0))
  }, [isLoading, data])
  return [{ data: hasPassport, isLoading, error }]
}

export function useClaimPassport() {
  return useContractWrite(
    {
      addressOrName: nationPassportNFTIssuer,
      contractInterface: PassportIssuer.abi,
    },
    'claim'
  )
}

export function usePassport(address) {
  const [{ data: id, loading }] = useContractRead(
    nftIssuerContractParams,
    'passportId',
    { args: [address], skip: !address }
  )
  console.log(`Passport ID ${id}`)
  //const { nft, loading } = useNft(nationPassportNFT, id?.toString())
  //console.log(nft)
  return [{ data: { id }, loading }]
}
