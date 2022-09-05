import { describe, expect, test } from '@jest/globals'
import { BigNumber } from 'ethers'
import { dateToReadable } from './date'

test("dateToReadable - February", () => {
  const actual = dateToReadable(new Date(2022, 1, 15, 23, 59))
  expect(actual).toBe('2022-02-15')
})

test("dateToReadable - December", () => {
  const actual = dateToReadable(new Date(2024, 11, 31, 23, 59))
  expect(actual).toBe('2024-12-31')
})
