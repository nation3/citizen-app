import ERC20 from '../abis/ERC20.json'
import { useContractRead } from './use-wagmi'
import { useContractWrite } from './use-wagmi'

export function useTokenAllowance({ token, address, spender }: any) {
  return useContractRead(
    {
      address: token,
      abi: ERC20.abi,
      watch: true,
      enabled: Boolean(token && address && spender),
    },
    'allowance',
    [address, spender]
  )
}

export function useTokenApproval({ amountNeeded, token, spender }: any) {
  return useContractWrite(
    {
      address: token,
      abi: ERC20.abi,
    },
    'approve',
    [spender, amountNeeded] 
  )
}
