import { useState, useEffect } from 'react'
import {
  useContractRead,
  useContractWrite,
  useBalance,
  developmentChains,
} from 'wagmi'

// import rewardsContractABI from '../abis/LiquidityRewardsDistributor.json'

export function useLiquidityRewards({ nationPrice, poolValue, address }) {
  /*const [{ data: totalRewardsData, loading: totalRewardsLoading }] =
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
    )*/

  const [liquidityRewardsAPY, setLiquidityRewardsAPY] = useState(0)

  /*useEffect(() => {
    setLiquidityRewardsAPY((totalRewardsData * nationPrice) / poolValue)
  }, [totalRewardsLoading, unclaimedRewardsLoading, stakingBalanceLoading])*/
  useEffect(() => {
    setLiquidityRewardsAPY(100)
  })

  const unclaimedRewardsData = 10000
  const stakingBalanceData = 100
  return [{ liquidityRewardsAPY, unclaimedRewardsData, stakingBalanceData }]
}

export function usePoolTokenBalance(address) {
  const [{ data, loading }] = useBalance({
    addressOrName: address,
    token:
      '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512' ||
      process.env.BALANCER_NATION_ETH_POOL_TOKEN,
    watch: true,
  })

  console.log(data)

  return [{ data, loading }]
}

export function useClaimRewards() {
  return useContractWrite(
    {
      addressOrName: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
      contractInterface: rewardsContractABI,
    },
    'claimRewards'
  )
}

function depositOrWithdraw(action) {
  return useContractWrite(
    {
      addressOrName: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
      contractInterface: rewardsContractABI,
    },
    'deposit',
    { args: amount }
  )
}

export function useDeposit(amount) {
  return depositOrWithdraw('deposit', amount)
}

export function useWithdraw(amount) {
  return depositOrWithdraw('withdraw', amount)
}

export function useWithdrawAndClaim(amount) {
  return useContractWrite(
    {
      addressOrName: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
      contractInterface: rewardsContractABI,
    },
    'withdrawAndClaim'
  )
}
