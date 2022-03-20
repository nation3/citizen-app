import { useBalance } from 'wagmi'

export function useNationBalance(address) {
  const [{ data: balanceData, loading: balanceLoading }] = useBalance({
    addressOrName: address,
    token: process.env.NEXT_PUBLIC_NATION_ADDRESS,
    watch: true,
  })

  return [{ balanceData, balanceLoading }]
}
