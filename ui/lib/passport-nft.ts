import { useEffect, useState } from 'react'
import { useNft } from 'use-nft'
import PassportIssuer from '../abis/PassportIssuer.json'
import { nationPassportNFT, nationPassportNFTIssuer } from './config'
import { useContractRead, useContractWrite } from './use-wagmi'

const nftIssuerContractParams = {
  address: nationPassportNFTIssuer,
  abi: PassportIssuer.abi,
}

export function useHasPassport(address: any) {
  const [hasPassport, setHasPassport] = useState(false)
  const { data: passportStatus, isLoading } = usePassportStatus(address)

  useEffect(() => {
    if (passportStatus == 1) {
      setHasPassport(true)
    }
  }, [passportStatus, isLoading])

  return { hasPassport, isLoading }
}

export function usePassportStatus(address: any) {
  return useContractRead(
    {
      ...nftIssuerContractParams,
      watch: true,
      enabled: Boolean(address),
    },
    'passportStatus',
    [address],
    undefined,
    false
  )
}


export function useClaimRequiredBalance() {
  return useContractRead(
    {
      ...nftIssuerContractParams,
      watch: true,
      enabled: false,
    },
    'claimRequiredBalance',
    undefined,
  )
}

export function useClaimPassport() {
  return useContractWrite(
    {
      address: nationPassportNFTIssuer,
      abi: PassportIssuer.abi,
    },
    'claim',
    undefined
  )
}

export function usePassport(address: any) {
  const { data: id, isLoading: loadingID } = useContractRead(
    {
      ...nftIssuerContractParams,
      enable: Boolean(address)
    },
    'passportId',
    [address],
    undefined,
    false
  )
  console.log(`Passport ID ${id}`)
  const { loading, nft } = useNft(nationPassportNFT || '', id)
  return { data: { id, nft }, isLoading: loadingID || loading }
}

export function usePassportRevokeUnderBalance() {
  return useContractRead(
    {
      ...nftIssuerContractParams,
    },
    'revokeUnderBalance',
    undefined
  )
}
