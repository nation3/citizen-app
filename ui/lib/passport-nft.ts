import { useState, useEffect } from 'react'
import { NftProvider, useNft } from 'use-nft'
import { nationPassportNFT, nationPassportNFTIssuer } from './config'
import PassportIssuer from '../abis/PassportIssuer.json'
import PassportNFT from '../abis/Passport.json'
import { useContractRead, useWagmiContractWrite } from './use-wagmi'

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
    false,
  )
}

export function useClaimPassport() {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  return useWagmiContractWrite(
    {
      addressOrName: nationPassportNFTIssuer,
      contractInterface: PassportIssuer.abi,
    },
    'claim'
  )
}

export function usePassport(address: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  const { data: id, isLoading } = useContractRead(
    nftIssuerContractParams,
    'passportId',
    { args: [address], skip: !address }
  )
  console.log(`Passport ID ${id}`)
  //const { nft, loading } = useNft(nationPassportNFT, id?.toString())
  //console.log(nft)
  return { data: { id }, isLoading }
}
