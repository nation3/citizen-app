import { useEffect, useState } from 'react'
import { useNft } from 'use-nft'
import PassportNFT from '../abis/Passport.json'
import PassportIssuer from '../abis/PassportIssuer.json'
import { nationPassportNFT, nationPassportNFTIssuer } from './config'
import { useContractRead, useContractWrite } from './use-wagmi'

const nftIssuerContractParams = {
  addressOrName: nationPassportNFTIssuer,
  contractInterface: PassportIssuer.abi,
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
    nftIssuerContractParams,
    'passportStatus',
    {
      args: [address],
      watch: true,
      enabled: Boolean(address),
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

export function usePassportSigner(id: number) {
  return useContractRead(
    {
      addressOrName: nationPassportNFT,
      contractInterface: PassportNFT.abi,
    },
    'signerOf',
    {
      args: [id],
      watch: true,
      enable: id,
    }
  )
}

export function useSetPassportSigner(id: number, signerAddress: string) {
  return useContractWrite(
    {
      addressOrName: nationPassportNFT,
      contractInterface: PassportNFT.abi,
    },
    'setSigner',
    {
      args: [id, signerAddress],
    }
  )
}
