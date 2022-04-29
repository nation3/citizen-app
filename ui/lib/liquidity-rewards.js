import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { lpRewardsContract, balancerLPToken } from '../lib/config'
import LiquidityRewardsDistributor from '../abis/BoostedLiquidityRewardsDistributor.json'
import { transformNumber } from './numbers'
import { useBalance, useContractRead, useContractWrite } from './use-wagmi'

const contractParams = {
  addressOrName: lpRewardsContract,
  contractInterface: LiquidityRewardsDistributor.abi,
}

export function useLiquidityRewards({ nationPrice, poolValue, address }) {
  /*const [{ data: totalRewards, loading: totalRewardsLoading }] =
    useContractRead(contractParams, 'totalRewards')*/
  const totalRewards = transformNumber(500, 'bignumber', 18)
  const totalRewardsLoading = false
  const months = transformNumber(6, 'bignumber', 0)

  const [{ data: unclaimedRewards, loading: unclaimedRewardsLoading }] =
    useContractRead(contractParams, 'getUnclaimedRewards', {
      args: [address],
      watch: true,
      skip: !address,
    })

  const [{ data: userDeposit, loading: userDepositLoading }] = useContractRead(
    contractParams,
    'userDeposit',
    {
      args: [address],
      watch: true,
      skip: !address,
    }
  )

  const [{ data: totalDeposit, loading: totalDepositLoading }] =
    useContractRead(contractParams, 'totalDeposit')

  const [liquidityRewardsAPY, setLiquidityRewardsAPY] = useState(0)

  useEffect(() => {
    if (totalRewards && poolValue) {
      setLiquidityRewardsAPY(
        totalRewards
          .div(months)
          .mul(transformNumber(nationPrice, 'bignumber', 2))
          .div(poolValue)
      )
    }
  }, [poolValue, nationPrice])
  // totalRewards, totalRewardsLoading,

  return [
    {
      liquidityRewardsAPY,
      unclaimedRewards,
      userDeposit,
      totalDeposit,
      loading:
        totalRewardsLoading ||
        unclaimedRewardsLoading ||
        userDepositLoading ||
        totalDepositLoading,
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

// userDeposit = amount of LP tokens staked by user
// totalDeposit = amount of LP tokens in rewards contract
// userVotingPower = veNationBalance
// totalVotingPower = veNATION supply
// min(userDeposit, (_totalDeposit * userPower / totalPower) * (100 - BOOSTLESS_PRODUCTION) / 100)
export function useVeNationBoost({
  userDeposit,
  totalDeposit,
  userVeNation,
  totalVeNation,
}) {
  const [boost, setBoost] = useState(0)
  useEffect(() => {
    //  && totalVeNation
    if (userDeposit && totalDeposit && userVeNation) {
      totalVeNation = transformNumber(6666, 'bignumber', 0)

      userDeposit = transformNumber(userDeposit, 'number')
      totalDeposit = transformNumber(totalDeposit, 'number')
      userVeNation = transformNumber(userVeNation, 'number')
      totalVeNation = 6666
      console.log({
        userDeposit,
        totalDeposit,
        userVeNation,
        totalVeNation,
      })
      let boost =
        (userDeposit * 40) / 100 +
        (((totalDeposit * userVeNation) / totalVeNation) * 60) / 100
      boost = 1 + boost
      console.log(boost)
      setBoost(transformNumber(boost, 'bignumber', 18))
    }
  }, [userDeposit, totalDeposit, userVeNation, totalVeNation])

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
