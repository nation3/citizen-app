// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../abis/ERC20.json'. Consider ... Remove this comment to see the full error message
import ERC20 from '../abis/ERC20.json'
import { useContractRead } from './use-wagmi'
import { useContractWrite } from './use-wagmi'

export function useTokenAllowance({
  token,
  address,
  spender
}: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  return useContractRead(
    {
      addressOrName: token,
      contractInterface: ERC20.abi,
    },
    'allowance',
    {
      args: [address, spender],
      watch: true,
      enabled: token && address && spender,
    }
  )
}

export function useTokenApproval({
  amountNeeded,
  token,
  spender
}: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  return useContractWrite(
    {
      addressOrName: token,
      contractInterface: ERC20.abi,
    },
    'approve',
    { args: [spender, amountNeeded] }
  )
}
