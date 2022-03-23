import { useState, useEffect } from 'react'
import { NftProvider, useNft } from 'use-nft'
import { nationPassportNFT } from '../lib/config'
import { nationPassportNFTIssuer } from '../lib/config'
// import ERC721ABI from '../abis/ERC721.json'
import PassportABI from '../abis/ERC721.json'
import PassportIssuerABI from '../abis/PassportIssuer.json'
import { useContractRead, useContractWrite } from './use-wagmi'

export function useHasPassport(address) {
  const [hasPassport, setHasPassport] = useState(false)
  const [{ data, loading, error }] = useContractRead(
    {
      addressOrName: nationPassportNFT,
      contractInterface: PassportABI,
    },
    'balanceOf',
    { args: address, skip: !address, watch: true }
  )
  useEffect(() => {
    setHasPassport(data && data.gt(0))
  }, [loading])
  return [{ data: hasPassport, loading, error }]
}

export function useMintPassport() {
  return useContractWrite(
    {
      addressOrName: nationPassportNFTIssuer,
      contractInterface: PassportIssuerABI,
    },
    'secure'
  )
}

export function usePassport(address) {
  const [{ data: id, loading: loadingId }] = useContractRead(
    {
      addressOrName: nationPassportNFT,
      contractInterface: PassportABI,
    },
    'balanceOf',
    { args: address, skip: !address }
  )
  console.log(`Passport ID ${id}`)
  const { nft, loading } = useNft(nationPassportNFT, id?.toString())
  console.log(nft)
  return [{ data: nft, loading }]
}
