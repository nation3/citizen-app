import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { lpRewardsContract, balancerLPToken } from '../lib/config'
import LiquidityRewardsDistributor from '../abis/LiquidityRewardsDistributor.json'
import { useBalance, useContractRead, useContractWrite } from './use-wagmi'

const formatNumber = (number) => {
  if (number) {
    return ethers.utils.formatEther(number)
  }
  return number
}

const contractParams = {
  addressOrName: lpRewardsContract,
  contractInterface: LiquidityRewardsDistributor.abi,
}

export function useLiquidityRewards({ nationPrice, poolValue, address }) {
  const [{ data: totalRewards, loading: totalRewardsLoading }] =
    useContractRead(contractParams, 'totalRewards')

  const [{ data: unclaimedRewards, loading: unclaimedRewardsLoading }] =
    useContractRead(contractParams, 'getUnclaimedRewards', {
      args: [address],
      watch: true,
      skip: !address,
    })

  const [{ data: stakingBalance, loading: stakingBalanceLoading }] =
    useContractRead(contractParams, 'getStakingBalance', {
      args: [address],
      watch: true,
      skip: !address,
    })
  const [liquidityRewardsAPY, setLiquidityRewardsAPY] = useState(0)

  useEffect(() => {
    if (totalRewards) {
      setLiquidityRewardsAPY(
        (ethers.utils.formatEther(totalRewards) * nationPrice * 100) / poolValue
      )
    }
  }, [totalRewards, totalRewardsLoading, poolValue, nationPrice])

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
  return useContractWrite(contractParams, 'claimRewards')
}

export function useDeposit(amount) {
  return useContractWrite(contractParams, 'deposit', { args: [amount] })
}

export function useWithdraw(amount) {
  return useContractWrite(contractParams, 'withdraw', { args: [amount] })
}

export function useWithdrawAndClaim(amount) {
  return useContractWrite(contractParams, 'withdrawAndClaim')
}
