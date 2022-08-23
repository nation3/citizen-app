import { describe, expect, test } from '@jest/globals'
import { BigNumber } from 'ethers'
import { NumberType, transformNumber } from './numbers'

test("transformNumber to Number", () => {
  const actual = transformNumber(333, NumberType.number)
  expect(actual).toBe(Number(333))
})

test("transformNumber to BigNumber", () => {
  const actual = transformNumber(333, NumberType.bignumber)
  expect(actual).toBeInstanceOf(BigNumber)
})

test("transformNumber to String", () => {
  const actual = transformNumber(333, NumberType.string)
  expect(actual).toBe("333.000000000000000000")
})

test("transformNumber to String (2 decimals)", () => {
  const actual = transformNumber(333, NumberType.string, 2)
  expect(actual).toBe("333.00")
})
