import { ethers } from "ethers";
import { useMemo } from "react";
import { getPassportExpirationDate } from "./passport-expiration";
import { useAccount } from "./use-wagmi";
import { useVeNationLock } from "./ve-token";
import {
  useContractRead,
} from './use-wagmi'
import { nationPassportNFTIssuer } from '../lib/config'
import PassportIssuer from '../abis/PassportIssuer.json'
export function usePassportExpirationDate(): Date | undefined {
  const { address } = useAccount()
  const { data: veNationLock } = useVeNationLock(address)

  const contractParams = {
    address: nationPassportNFTIssuer,
    abi: PassportIssuer.abi,
  }
  const { data: revokeUnderBalance } =
    useContractRead(contractParams, 'revokeUnderBalance')

  return useMemo(() => {
    if (!veNationLock || !revokeUnderBalance) {
      return undefined;
    }

    const [lockAmount, lockEnd]: [ethers.BigNumber, ethers.BigNumber] = veNationLock;
    return getPassportExpirationDate(lockAmount, lockEnd, revokeUnderBalance);
  }, [veNationLock, revokeUnderBalance]);
}
