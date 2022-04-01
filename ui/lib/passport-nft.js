import { useState, useEffect } from 'react'
import { NftProvider, useNft } from 'use-nft'
import { nationPassportNFT } from '../lib/config'
import { nationPassportNFTIssuer } from '../lib/config'
import PassportIssuer from '../abis/PassportIssuer.json'
import PassportNFT from '../abis/PassportNFT.json'
import { useContractRead, useContractWrite } from './use-wagmi'

const contractParams = {
  addressOrName: nationPassportNFT,
  contractInterface: PassportNFT.abi,
}

export function useHasPassport(address) {
  const [hasPassport, setHasPassport] = useState(false)
  const [{ data, loading, error }] = useContractRead(
    contractParams,
    'balanceOf',
    {
      args: address,
      watch: true,
      skip: !address,
    }
  )
  useEffect(() => {
    setHasPassport(data && data.gt(0))
  }, [loading])
  return [{ data: hasPassport, loading, error }]
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
  const [{ data: id, loading: loadingId }] = useContractRead(
    contractParams,
    'balanceOf',
    { args: address, skip: !address }
  )
  console.log(`Passport ID ${id}`)
  const { nft, loading } = useNft(nationPassportNFT, id?.toString())
  console.log(nft)
  return [{ data: nft, loading }]
}
