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
  const [{ data: totalRewards, loading: totalRewardsLoading }] =
    useContractRead(contractParams, 'totalRewards')
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
          .mul(transformNumber(1, 'bignumber'))
      )
    }
  }, [poolValue, nationPrice, totalRewards, totalRewardsLoading])

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
  return useBalance({
    addressOrName: address,
    token: balancerLPToken,
    watch: true,
    skip: !address,
  })
}

// userDeposit = amount of LP tokens staked by user
// totalDeposit = amount of LP tokens in rewards contract
// userVotingPower = veNationBalance
// totalVotingPower = veNATION supply
export function useVeNationBoost({
  userDeposit,
  totalDeposit,
  userVeNation,
  totalVeNation,
}) {
  const [boost, setBoost] = useState({
    canBoost: false,
  })
  useEffect(() => {
    if (userDeposit && totalDeposit && userVeNation && totalVeNation) {
      const bn = {
        userDeposit: transformNumber(userDeposit, 'number', 18),
        totalDeposit: transformNumber(totalDeposit, 'number', 18),
        userVeNation: transformNumber(userVeNation, 'number', 18),
        totalVeNation: transformNumber(totalVeNation, 'number', 18),
      }

      const currentBoost = bn.userVeNation / (bn.userDeposit * 0.4)

      let boostedBalance =
        (bn.userDeposit * 40) / 100 +
        (((bn.totalDeposit * bn.userVeNation) / bn.totalVeNation) * 60) / 100

      if (boostedBalance >= bn.userDeposit) boostedBalance = bn.userDeposit
      const boost = boostedBalance / (bn.userDeposit * 0.4)

      console.log({
        userDeposit,
        totalDeposit,
        userVeNation,
        totalVeNation,
      })
      console.log(`Boost: ${boost}`)
      setBoost({
        currentBoost: transformNumber(currentBoost, 'bignumber', 18),
        potentialBoost: transformNumber(boost, 'bignumber', 18),
        canBoost: boost > currentBoost,
      })
    }
  }, [userDeposit, totalDeposit, userVeNation, totalVeNation])

  return boost
}

export function useClaimRewards() {
  return useContractWrite(contractParams, 'claimRewards')
}

export function useDeposit(amount) {
  return useContractWrite(contractParams, 'deposit', {
    args: [amount],
    overrides: { gasLimit: 300000 },
  })
}

export function useWithdraw(amount) {
  return useContractWrite(contractParams, 'withdraw', {
    args: [amount],
    overrides: { gasLimit: 300000 },
  })
}

export function useWithdrawAndClaim() {
  return useContractWrite(contractParams, 'withdrawAndClaim')
}
