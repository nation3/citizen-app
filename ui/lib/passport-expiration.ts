import { ethers } from "ethers";

const fourYearsInSeconds = 31556926 * 4
const maxLockPeriod = ethers.BigNumber.from(fourYearsInSeconds);

// threshold <= (lock amount) * (lock end - expiration) / (max lock period)
// threshold * (max lock period) / (lock amount) <= (lock end - expiration)
// expiration <= (lock end) - threshold * (max lock period) / (lock amount)
export function getPassportExpirationDate(lockAmount: ethers.BigNumber, lockEnd: ethers.BigNumber, threshold: ethers.BigNumber): Date | undefined {
  if (lockAmount.isZero()) return undefined;
  const expiration = lockEnd.sub(threshold.mul(maxLockPeriod).div(lockAmount));
  return new Date(expiration.mul(1000).toNumber());
}
