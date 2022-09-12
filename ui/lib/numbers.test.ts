import { describe, expect, test } from '@jest/globals'
import { BigNumber } from 'ethers'
import { NumberType, transformNumber, isFixedDecimalsNumber } from './numbers'

describe('transformNumber', () => {
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
})

describe('isFixedDecimalsNumber', () => {
  test('Is working for integers', () => {
    const isValid = isFixedDecimalsNumber(12345);
    expect(isValid).toBe(true)
  })

  test('Fails for too long decimals', () => {
    const isValid = isFixedDecimalsNumber('1.111111111111111111111111111111');
    expect(isValid).toBe(false)
  })

  test('Check "decimals" param is working properly', ()=> {
    const isValid = isFixedDecimalsNumber(1.12345, 2);
    expect(isValid).toBe(false)
  })
})