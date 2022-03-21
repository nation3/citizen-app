import { useEffect } from 'react'
import { useContractRead, useContractWrite } from 'wagmi'
import ERC20ABI from '../abis/ERC20.json'

export function useTokenAllowance({ token, address, spender }) {
  return useContractRead(
    {
      addressOrName: token,
      contractInterface: ERC20ABI,
    },
    'allowance',
    { args: [address, spender] }
  )
}

export function useTokenApproval({ amountNeeded, token, spender }) {
  console.log(spender)
  console.log(amountNeeded)
  return useContractWrite(
    {
      addressOrName: token,
      contractInterface: ERC20ABI,
    },
    'approve',
    { args: [spender, amountNeeded] }
  )
}
