import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { lpRewardsContract, balancerLPToken } from '../lib/config'
import LiquidityRewardsDistributor from '../abis/LiquidityRewardsDistributor.json'
import { transformNumber } from './numbers'
import { useBalance, useContractRead, useContractWrite } from './use-wagmi'

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
        totalRewards
          .mul(transformNumber(nationPrice, 'bignumber', 0))
          .mul(100)
          .div(poolValue)
      )
    }
  }, [totalRewards, totalRewardsLoading, poolValue, nationPrice])

  return [
    {
      liquidityRewardsAPY,
      unclaimedRewards: unclaimedRewards,
      stakingBalance: stakingBalance,
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

// userStake = amount of LP tokens staked by user
// totalStake = amount of LP tokens in rewards contract
// userVotingPower = veNationBalance
// totalVotingPower = veNATION supply
// min(userStake, userStake * 40/100 + totalStake * userVotingPower / totalVotingPower * 60/100)
export function useVeNationBoost({
  userStake,
  totalStake,
  userVeNation,
  totalVeNation,
}) {
  const [boost, setBoost] = useState(0)
  useEffect(() => {
    if (userStake && totalStake && userVeNation && totalVeNation) {
      const userStakePercentage = userStake.mul(
        transformNumber(40 / 100, 'bignumber', 1)
      )

      const userVotingPercentage = totalStake
        .mul(userVeNation)
        .div(totalVeNation.mul(transformNumber(60 / 100, 'bignumber', 1)))
      const boost = userStakePercentage.add(userVotingPercentage)
      setBoost(userStake.gt(boost) ? userStake : boost)
      console.log(boost)
    }
  }, [userStake, totalStake, userVeNation, totalVeNation])

  return boost
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
