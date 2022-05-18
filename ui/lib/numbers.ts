import { ethers } from 'ethers'

function stringToNumber(string, decimals) {
  return Number(string).toFixed(decimals)
}

export function transformNumber(number, to, decimals) {
  if (!number) {
    return to === 'bignumber' ? ethers.BigNumber.from('0') : 0
  }

  if (to === 'bignumber') {
    if (number instanceof ethers.BigNumber) return number

    return ethers.utils.parseUnits(
      typeof number === 'string' ? number : number.toString(),
      decimals
    )
  } else if (to === 'number') {
    if (typeof number === 'number') return number

    if (number instanceof ethers.BigNumber) {
      return stringToNumber(ethers.utils.formatUnits(number, 18), decimals)
    } else if (typeof number === 'string') {
      return parseFloat(number).toFixed(decimals)
    }
  } else if (to === 'string') {
    if (typeof number === 'string') return number

    if (number instanceof ethers.BigNumber) {
      return stringToNumber(
        ethers.utils.formatUnits(number, 18),
        decimals
      ).toString()
    } else if (typeof number === 'number') {
      return number.toFixed(decimals).toString()
    }
  }
}
