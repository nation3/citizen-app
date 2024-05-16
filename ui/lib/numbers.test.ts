import { describe, expect, test } from '@jest/globals'
import { BigNumber } from 'ethers'
import {
  NumberType,
  formatNumberAsPercentage,
  isFixedDecimalsNumber,
  transformNumber,
} from './numbers'

describe('transformNumber', () => {
  test('transformNumber to Number', () => {
    const actual = transformNumber(333, NumberType.number)
    expect(actual).toBe(Number(333))
  })

  test('transformNumber to BigNumber', () => {
    const actual = transformNumber(333, NumberType.bignumber)
    expect(actual).toBeInstanceOf(BigNumber)
  })

  test('transformNumber to String', () => {
    const actual = transformNumber(333, NumberType.string)
    expect(actual).toBe('333.000000000000000000')
  })

  test('transformNumber to String (2 decimals)', () => {
    const actual = transformNumber(333, NumberType.string, 2)
    expect(actual).toBe('333.00')
  })
})

describe('isFixedDecimalsNumber', () => {
  test('Is working for integers', () => {
    const isValid = isFixedDecimalsNumber(12345)
    expect(isValid).toBe(true)
  })

  test('Fails for too long decimals', () => {
    const isValid = isFixedDecimalsNumber('1.111111111111111111111111111111')
    expect(isValid).toBe(false)
  })

  test('Check "decimals" param is working properly', () => {
    const isValid = isFixedDecimalsNumber(1.12345, 2)
    expect(isValid).toBe(false)
  })
})

describe.only('formatNumberAsPercentage', () => {
  describe('toTwoDecimalPlaces', () => {
    it('should return a number with 2 decimal places for whole numbers', () => {
      expect(formatNumberAsPercentage(5)).toBe(5.0)
    })

    it('should return a number with 2 decimal places for decimal numbers', () => {
      expect(formatNumberAsPercentage(5.1234)).toBe(5.12)
    })

    it('should return 0.00 when the input is 0', () => {
      expect(formatNumberAsPercentage(0)).toBe(0.0)
    })
    it('should return 1254.09 when the input is 1254.093584459813', () => {
      expect(formatNumberAsPercentage(1254.093584459813)).toBe(1254.09)
    })
  })
})
