import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { nationRewardsContract, balancerLPToken } from '../lib/config'
import rewardsContractABI from '../abis/LiquidityRewardsDistributor.json'
import { useBalance, useContractRead, useContractWrite } from './use-wagmi'

const formatNumber = (number) => {
  if (number) {
    return ethers.utils.formatEther(number)
  }
  return number
}

export function useLiquidityRewards({ nationPrice, poolValue, address }) {
  const [{ data: totalRewards, loading: totalRewardsLoading }] =
    useContractRead(
      {
        addressOrName: nationRewardsContract,
        contractInterface: rewardsContractABI,
      },
      'totalRewards',
      {
        skip: !nationRewardsContract,
      }
    )

  const [{ data: unclaimedRewards, error, loading: unclaimedRewardsLoading }] =
    useContractRead(
      {
        addressOrName: nationRewardsContract,
        contractInterface: rewardsContractABI,
      },
      'getUnclaimedRewards',
      {
        args: [address],
        watch: true,
        skip: !nationRewardsContract,
      }
    )

  const [
    {
      data: stakingBalance,
      error: stakingBalanceError,
      loading: stakingBalanceLoading,
    },
  ] = useContractRead(
    {
      addressOrName: nationRewardsContract,
      contractInterface: rewardsContractABI,
    },
    'getStakingBalance',
    {
      args: [address],
      watch: true,
      skip: !nationRewardsContract,
    }
  )
  const [liquidityRewardsAPY, setLiquidityRewardsAPY] = useState(0)

  useEffect(() => {
    if (totalRewards) {
      setLiquidityRewardsAPY(
        (ethers.utils.formatEther(totalRewards) * nationPrice * 100) / poolValue
      )
    }
  }, [totalRewardsLoading])

  return [
    {
      liquidityRewardsAPY,
      unclaimedRewards: formatNumber(unclaimedRewards),
      stakingBalance: formatNumber(stakingBalance),
      loading:
        totalRewardsLoading || unclaimedRewardsLoading || stakingBalanceLoading,
    },
  ]
}

export function usePoolTokenBalance(address) {
  const [{ data, loading }] = useBalance({
    addressOrName: address,
    token: balancerLPToken,
    watch: true,
    skip: !address,
  })

  return [{ data, loading }]
}

export function useClaimRewards() {
  return useContractWrite(
    {
      addressOrName: nationRewardsContract,
      contractInterface: rewardsContractABI,
    },
    'claimRewards'
  )
}

export function useDeposit(amount) {
  return useContractWrite(
    {
      addressOrName: nationRewardsContract,
      contractInterface: rewardsContractABI,
    },
    'deposit',
    { args: [amount] }
  )
}

export function useWithdraw(amount) {
  return useContractWrite(
    {
      addressOrName: nationRewardsContract,
      contractInterface: rewardsContractABI,
    },
    'withdraw',
    { args: [amount] }
  )
}

export function useWithdrawAndClaim(amount) {
  return useContractWrite(
    {
      addressOrName: nationRewardsContract,
      contractInterface: rewardsContractABI,
    },
    'withdrawAndClaim'
  )
}
