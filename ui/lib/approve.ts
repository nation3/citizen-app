import ERC20 from '../abis/ERC20.json'
import { useContractRead } from './use-wagmi'
import { useContractWrite } from './use-wagmi'

export function useTokenAllowance({ token, address, spender }: any) {
  return useContractRead({
    addressOrName: token,
    contractInterface: ERC20.abi,
    functionName: 'allowance',
    args: [address, spender],
    watch: true,
    enabled: token && address && spender
  })
}

export function useTokenApproval({ amountNeeded, token, spender }: any) {
  return useContractWrite(
    {
      addressOrName: token,
      contractInterface: ERC20.abi,
      functionName: 'approve',
      args: [spender, amountNeeded] 
    },
    
  )
}
