import { ethers } from 'ethers'
import { useMemo } from 'react'
import PassportIssuer from '../abis/PassportIssuer.json'
import { nationPassportNFTIssuer } from './config'
import { getPassportExpirationDate } from './passport-expiration'
import { useAccount, useContractRead } from './use-wagmi'
import { useVeNationLock } from './ve-token'

export function usePassportExpirationDate(): Date | undefined {
  const { address } = useAccount()

  const { data: veNationLock } = useVeNationLock(address)

  const { data: threshold, error } = useContractRead(
    {
      address: nationPassportNFTIssuer,
      abi: PassportIssuer.abi,
    },
    'revokeUnderBalance'
  )

  return useMemo(() => {
    if (!veNationLock) {
      return undefined
    }

    const [lockAmount, lockEnd]: [ethers.BigNumber, ethers.BigNumber] =
      veNationLock

    return getPassportExpirationDate(lockAmount, lockEnd, threshold!)
  }, [veNationLock, threshold])
}
