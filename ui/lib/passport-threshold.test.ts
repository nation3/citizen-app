import { describe, expect, test } from '@jest/globals'
import {
  formatPassportBalance,
  getBufferedPassportBalance,
} from './passport-threshold'

describe('getBufferedPassportBalance', () => {
  test('adds a 0.01 minimum buffer for a 2 veNATION passport threshold', () => {
    expect(getBufferedPassportBalance(2)).toBe(2.01)
  })

  test('uses the percentage buffer when it is larger than the minimum', () => {
    expect(getBufferedPassportBalance(10)).toBe(10.05)
  })

  test('does not add a buffer to an empty threshold', () => {
    expect(getBufferedPassportBalance(0)).toBe(0)
  })
})

describe('formatPassportBalance', () => {
  test('prints whole numbers without decimals', () => {
    expect(formatPassportBalance(2)).toBe('2')
  })

  test('keeps two decimals for buffered values', () => {
    expect(formatPassportBalance(2.01)).toBe('2.01')
  })
})
