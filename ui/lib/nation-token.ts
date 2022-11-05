import { nationToken } from '../lib/config'
import { Address, useBalance } from 'wagmi'

export function useNationBalance({address}: {address: Address | undefined}) {
  return useBalance({
    addressOrName: address,
    token: nationToken,
    watch: true,
  })
}
