import { useContractRead } from 'wagmi'
import ERC20ABI from '../abis/ERC20.json'
import { useContractWrite } from './use-contract'

export function useTokenAllowance({ token, address, spender }) {
  return useContractRead(
    {
      addressOrName: token,
      contractInterface: ERC20ABI,
    },
    'allowance',
    { args: [address, spender], watch: true }
  )
}

export function useTokenApproval({ amountNeeded, token, spender }) {
  return useContractWrite(
    {
      addressOrName: token,
      contractInterface: ERC20ABI,
    },
    'approve',
    { args: [spender, amountNeeded] }
  )
}
