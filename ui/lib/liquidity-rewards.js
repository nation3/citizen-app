import { useState, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import rewardsContractABI from '../../contracts/externalABIs/balancerVault.json'

export function useLiquidityRewards({ nationPrice, poolValue, address }) {
  const [{ data: totalRewardsData, loading: totalRewardsLoading }] =
    useContractRead(
      {
        addressOrName:
          process.env.NEXT_PUBLIC_BALANCER_NATION_REWARDS_CONTRACT_ADDRESS,
        contractInterface: rewardsContractABI,
      },
      'totalRewards'
    )

  const [{ data: unclaimedRewardsData, loading: unclaimedRewardsLoading }] =
    useContractRead(
      {
        addressOrName:
          process.env.NEXT_PUBLIC_BALANCER_NATION_REWARDS_CONTRACT_ADDRESS,
        contractInterface: rewardsContractABI,
      },
      'getUnclaimedRewards',
      {
        args: address,
      }
    )

  const [{ data: stakingBalanceData, loading: stakingBalanceLoading }] =
    useContractRead(
      {
        addressOrName:
          process.env.NEXT_PUBLIC_BALANCER_NATION_REWARDS_CONTRACT_ADDRESS,
        contractInterface: rewardsContractABI,
      },
      'getStakingBalance',
      {
        args: address,
      }
    )

  const [liquidityRewardsAPY, setLiquidityRewardsAPY] = useState(0)

  useEffect(() => {
    setLiquidityRewardsAPY((totalRewardsData * nationPrice) / poolValue)
  }, [totalRewardsLoading, unclaimedRewardsLoading, stakingBalanceLoading])
  return [{ liquidityRewardsAPY, unclaimedRewardsData, stakingBalanceData }]
}

export function usePoolTokenBalance(address) {
  const [{ data: balanceData, loading: balanceLoading }] = useBalance({
    addressOrName: address,
    token: process.env.BALANCER_NATION_ETH_POOL_TOKEN,
    watch: true,
  })

  return [{ balanceData, balanceLoading }]
}
