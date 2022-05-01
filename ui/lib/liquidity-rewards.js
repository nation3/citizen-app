import { useState, useEffect } from 'react'
import { lpRewardsContract, balancerLPToken } from '../lib/config'
import LiquidityRewardsDistributor from '../abis/BoostedLiquidityDistributor.json'
import { transformNumber } from './numbers'
import {
  useBalance,
  useContractRead,
  useContractWrite,
  useWagmiContractWrite,
} from './use-wagmi'

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

  const [{ data: userBalance, loading: userBalanceLoading }] = useContractRead(
    contractParams,
    'userBalance',
    {
      args: [address],
      watch: true,
      skip: !address,
    }
  )

  const [liquidityRewardsAPY, setLiquidityRewardsAPY] = useState(
    transformNumber(0, 'bignumber')
  )

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
      userBalance,
      loading:
        totalRewardsLoading ||
        unclaimedRewardsLoading ||
        userDepositLoading ||
        totalDepositLoading ||
        userBalanceLoading,
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
  userBalance,
}) {
  const [boost, setBoost] = useState({
    canBoost: false,
  })
  useEffect(() => {
    if (
      userDeposit &&
      totalDeposit &&
      userVeNation &&
      totalVeNation &&
      userBalance
    ) {
      const n = {
        userDeposit: parseFloat(transformNumber(userDeposit, 'number', 18)),
        totalDeposit: parseFloat(transformNumber(totalDeposit, 'number', 18)),
        userVeNation: parseFloat(transformNumber(userVeNation, 'number', 18)),
        totalVeNation: parseFloat(transformNumber(totalVeNation, 'number', 18)),
        userBalance: parseFloat(transformNumber(userBalance, 'number', 18)),
      }

      const currentBoost = n.userBalance / (n.userDeposit * 0.4)

      let boostedBalance =
        (n.userDeposit * 40) / 100 +
        ((n.totalDeposit + n.userVeNation / n.totalVeNation) * 60) / 100

      boostedBalance = Math.min(boostedBalance, n.userDeposit)

      const potentialBoost = boostedBalance / (n.userDeposit * 0.4)

      console.log(`Current boost: ${currentBoost}`)
      console.log(`Potential boost: ${potentialBoost}`)
      setBoost({
        currentBoost: transformNumber(
          Math.max(currentBoost, 1),
          'bignumber',
          18
        ),
        potentialBoost: transformNumber(potentialBoost, 'bignumber', 18),
        canBoost:
          Math.trunc(potentialBoost * 10) > Math.trunc(currentBoost * 10),
      })
    }
  }, [userDeposit, totalDeposit, userVeNation, totalVeNation, userBalance])

  return boost
}

export function useBoostedAPY({ defaultAPY, boostMultiplier }) {
  const [apy, setAPY] = useState(
    parseFloat(transformNumber(defaultAPY, 'number', 2))
  )
  useEffect(() => {
    if (!defaultAPY?.isZero() && !boostMultiplier?.isZero()) {
      setAPY(
        (transformNumber(defaultAPY, 'number', 2) / 10 ** 18) * boostMultiplier
      )
    }
  }, [defaultAPY, boostMultiplier])
  return apy
}

// Using Wagmi's contractWrite directly, getting a "no signer connected" error otherwise
export function useClaimRewards() {
  return useWagmiContractWrite(contractParams, 'claimRewards', {
    overrides: { gasLimit: 300000 },
  })
}

export function useDeposit(amount) {
  return useContractWrite(contractParams, 'deposit', {
    args: [amount],
  })
}

export function useWithdraw(amount) {
  return useContractWrite(contractParams, 'withdraw', {
    args: [amount],
  })
}

export function useWithdrawAndClaim() {
  return useWagmiContractWrite(contractParams, 'withdrawAndClaim')
}
