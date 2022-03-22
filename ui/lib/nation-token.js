import { useBalance } from './use-wagmi'

export function useNationBalance(address) {
  const [{ data: balanceData, loading: balanceLoading }] = useBalance({
    addressOrName: address,
    token: !process.env.NEXT_PUBLIC_DEV
      ? process.env.NEXT_PUBLIC_NATION_ADDRESS
      : '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    watch: true,
  })

  return [{ balanceData, balanceLoading }]
}
