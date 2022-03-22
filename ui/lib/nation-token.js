import { nationToken } from '../lib/config'
import { useBalance } from './use-wagmi'

export function useNationBalance(address) {
  const [{ data: balanceData, loading: balanceLoading }] = useBalance({
    addressOrName: address,
    token: nationToken,
    watch: true,
    skip: !address,
  })

  return [{ balanceData, balanceLoading }]
}
