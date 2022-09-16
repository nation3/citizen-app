import { ethers } from "ethers";
import { useMemo } from "react";
import { getPassportExpirationDate } from "./passport-expiration";
import { useAccount } from "./use-wagmi";
import { useVeNationLock } from "./ve-token";
import { nationPassportRevokeUnderBalance } from "../lib/config";

export function usePassportExpirationDate(): Date | undefined {
  const { data: account } = useAccount()
  const { data: veNationLock } = useVeNationLock(account?.address)

  const threshold = ethers.BigNumber.from(String(nationPassportRevokeUnderBalance * 10 ** 18));
    
  return useMemo(() => {
      if (!veNationLock) {
        return undefined;
      }

      const [lockAmount, lockEnd]: [ethers.BigNumber, ethers.BigNumber] = veNationLock;
      return getPassportExpirationDate(lockAmount, lockEnd, threshold);
  }, [veNationLock, threshold]);
}
