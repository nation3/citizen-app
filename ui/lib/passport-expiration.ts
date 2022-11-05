import { ethers } from "ethers";

const fourYearsInSeconds = 31556926 * 4
const maxLockPeriod = ethers.BigNumber.from(fourYearsInSeconds);

export function getPassportExpirationDate(lockAmount: ethers.BigNumber, lockEnd: ethers.BigNumber, threshold: ethers.BigNumber): Date | undefined {
  if (lockAmount.isZero()) return undefined;
  const expiration = lockEnd.sub(threshold.mul(maxLockPeriod).div(lockAmount));
  return new Date(expiration.mul(1000).toNumber());
}
