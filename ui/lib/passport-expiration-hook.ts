import { constants, ethers } from "ethers";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { getPassportExpirationDate } from "./passport-expiration";
import { useVeNationLock } from "./ve-token";
import { nationPassportRevokeUnderBalance } from "../lib/config";

export function usePassportExpirationDate(): Date | undefined {
  const { address, isConnected } = useAccount()
  const { data: veNationLock } = useVeNationLock({
      address: address || constants.AddressZero,
      enabled: isConnected
  })

  const threshold = ethers.BigNumber.from(String(nationPassportRevokeUnderBalance * 10 ** 18));
    
  return useMemo(() => {
      if (!veNationLock) {
        return undefined;
      }

      const { amount, end } = veNationLock;
      return getPassportExpirationDate(amount, end, threshold);

  }, [veNationLock, threshold]);
}
