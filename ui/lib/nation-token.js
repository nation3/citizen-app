import { nationToken } from '../lib/config'
import { useBalance } from './use-wagmi'

export function useNationBalance(address) {
  return useBalance({
    addressOrName: address,
    token: nationToken,
    watch: true,
    enabled: address,
  })
}
