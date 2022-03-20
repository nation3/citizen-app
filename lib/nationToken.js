import { useBalance } from 'wagmi'

export function useNationBalance(address) {
  const [{ data: balanceData, error, loading: balanceLoading }, getBalance] =
    useBalance({
      addressOrName: address,
      token: process.env.NEXT_PUBLIC_NATION_ADDRESS,
      watch: true,
    })

  return { balanceData, balanceLoading }
}
