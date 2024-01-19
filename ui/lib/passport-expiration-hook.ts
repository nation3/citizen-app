import { ethers } from 'ethers'
import { useEffect, useMemo } from 'react'
import { getPassportExpirationDate } from './passport-expiration'
import { usePassportRevokeUnderBalance } from './passport-nft'
import { useAccount } from './use-wagmi'
import { useVeNationLock } from './ve-token'

export function usePassportExpirationDate(): Date | undefined {
  const { address } = useAccount()
  const { data: veNationLock } = useVeNationLock(address)

  const { data: threshold } = usePassportRevokeUnderBalance()

  return useMemo(() => {
    if (!veNationLock) {
      return undefined
    }

    const [lockAmount, lockEnd]: [ethers.BigNumber, ethers.BigNumber] =
      veNationLock
    return getPassportExpirationDate(lockAmount, lockEnd, threshold)
  }, [veNationLock, threshold])
}
