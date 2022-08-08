import { ethers } from "ethers";
import { useMemo } from "react";
import { useAccount } from "./use-wagmi";
import { useVeNationLock } from "./ve-token";

const threshold = ethers.BigNumber.from(10).pow(18).mul(3).div(2);
const maxLockPeriod = ethers.BigNumber.from(31556926 * 4);

export function usePassportExpirationDate(): Date | undefined {
  const { data: account } = useAccount()
  const { data: veNationLock } =
    useVeNationLock(account?.address)
    
  return useMemo(() => {
      // threshold <= (lock amount) * (lock end - expiration) / (max lock period)
      // threshold * (max lock period) / (lock amount) <= (lock end - expiration)
      // expiration <= (lock end) - threshold * (max lock period) / (lock amount)
      if (!veNationLock) return undefined;
      const [lockAmount, lockEnd]: [ethers.BigNumber, ethers.BigNumber] = veNationLock;
      const expiration = lockEnd.sub(threshold.mul(maxLockPeriod).div(lockAmount));
      return new Date(expiration.mul(1000).toNumber());
  }, [veNationLock]);
}
