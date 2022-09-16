import { expect, test } from '@jest/globals';
import { BigNumber } from 'ethers';
import { getPassportExpirationDate } from './passport-expiration';

test("returns undefined if no lock amount", () => {
  const date = getPassportExpirationDate(BigNumber.from(0), BigNumber.from(0), BigNumber.from(String(1.5 * 10 ** 18)));
  expect(date).toBe(undefined);
})

const inFourYears = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 4;

test("returns past date if below threshold", () => {
  const date = getPassportExpirationDate(BigNumber.from(1).mul(String(10 ** 18)), BigNumber.from(inFourYears), BigNumber.from(String(1.5 * 10 ** 18)));
  expect(date).not.toBe(undefined);
  expect(date!.getTime() < Date.now()).toBe(true);
})

test("returns future date if over threshold", () => {
  const date = getPassportExpirationDate(BigNumber.from(2).mul(String(10 ** 18)), BigNumber.from(inFourYears), BigNumber.from(String(1.5 * 10 ** 18)));
  expect(date).not.toBe(undefined);
  expect(date!.getTime() > Date.now()).toBe(true);
})
