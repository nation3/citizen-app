import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { useBalance, useContractRead } from 'wagmi'
import { nationRewardsContract, balancerLPToken } from '../lib/config'
import rewardsContractABI from '../abis/LiquidityRewardsDistributor.json'
import { useContractWrite } from './working-use-contract-write'

const formatNumber = (number) => {
  if (number) {
    return ethers.utils.formatEther(number)
  }
  return number
}

export function useLiquidityRewards({ nationPrice, poolValue, address }) {
  console.log(nationRewardsContract)
  console.log(address)
  const [{ data: totalRewards, loading: totalRewardsLoading }] =
    useContractRead(
      {
        addressOrName: nationRewardsContract,
        contractInterface: rewardsContractABI,
      },
      'totalRewards'
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
      }
    )
  console.log(error)
  console.log(nationRewardsContract)
  console.log(rewardsContractABI)
  console.log(address)
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
    }
  )
  console.log(stakingBalanceError)
  const [liquidityRewardsAPY, setLiquidityRewardsAPY] = useState(0)

  useEffect(() => {
    setLiquidityRewardsAPY((totalRewards * nationPrice) / poolValue)
  }, [totalRewardsLoading, unclaimedRewardsLoading, stakingBalanceLoading])

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

function depositOrWithdraw(action, amount) {
  return useContractWrite(
    {
      addressOrName: nationRewardsContract,
      contractInterface: rewardsContractABI,
    },
    action,
    { args: [amount] }
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
      addressOrName: nationRewardsContract,
      contractInterface: rewardsContractABI,
    },
    'withdrawAndClaim'
  )
}
