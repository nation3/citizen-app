import { BigNumber, ethers } from 'ethers'

function stringToNumber(string: any, decimals: any) {
  return Number(string).toFixed(decimals)
}

export enum NumberType {
  number = 'number',
  bignumber = 'bignumber',
  string = 'string',
}

export function transformNumber(
  num: number | BigNumber | string,
  to: NumberType,
  decimals = 18
): BigNumber | string | number {
  if (!num) {
    return to === NumberType.bignumber ? ethers.BigNumber.from('0') : 0
  }

  if (to === NumberType.bignumber) {
    if (num instanceof ethers.BigNumber) return num

    return ethers.utils.parseUnits(
      typeof num === 'string' ? num : num.toString(),
      decimals
    )
  } else if (to === NumberType.number) {
    if (typeof num === 'number') return num

    if (num instanceof ethers.BigNumber) {
      return stringToNumber(ethers.utils.formatUnits(num, 18), decimals)
    } else if (typeof num === 'string') {
      return parseFloat(num).toFixed(decimals)
    }
  } else if (to === NumberType.string) {
    if (typeof num === 'string') return num

    if (num instanceof ethers.BigNumber) {
      return stringToNumber(
        ethers.utils.formatUnits(num, 18),
        decimals
      ).toString()
    } else if (typeof num === 'number') {
      return num.toFixed(decimals).toString()
    }
  }
  return 0
}
