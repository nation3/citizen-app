import { ethers } from 'ethers'
import { useMemo } from 'react'
import { nationPassportNFTIssuer } from './config'
import { getRevokeUnderBalance } from './get-revoke-under-balance'
import { getPassportExpirationDate } from './passport-expiration'
import { useAccount } from './use-wagmi'
import { useVeNationLock } from './ve-token'

export function usePassportExpirationDate(): Date | undefined {
  const { address } = useAccount()
  const { data: veNationLock } = useVeNationLock(address)

  let threshold: any

  getRevokeUnderBalance(nationPassportNFTIssuer)
    .then((res) => {
      threshold = ethers.BigNumber.from(res)
    })
    .catch((err) => console.error(err.message))

  return useMemo(() => {
    if (!veNationLock) {
      return undefined
    }

    const [lockAmount, lockEnd]: [ethers.BigNumber, ethers.BigNumber] = veNationLock

    return getPassportExpirationDate(lockAmount, lockEnd, threshold)
  }, [veNationLock, threshold])
}
