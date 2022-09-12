import { ethers } from "ethers";
import { useMemo } from "react";
import { getPassportExpirationDate } from "./passport-expiration";
import { useAccount } from "./use-wagmi";
import { useVeNationLock } from "./ve-token";

export function usePassportExpirationDate(): Date | undefined {
  const { data: account } = useAccount()
  const { data: veNationLock } = useVeNationLock(account?.address)
    
  return useMemo(() => {
      if (!veNationLock) {
        return undefined;
      }

      const [lockAmount, lockEnd]: [ethers.BigNumber, ethers.BigNumber] = veNationLock;
      return getPassportExpirationDate(lockAmount, lockEnd);
  }, [veNationLock]);
}
