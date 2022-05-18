import { useState, useEffect } from 'react'
import { lpRewardsContract, balancerLPToken } from '../lib/config'
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../abis/BoostedLiquidityDistri... Remove this comment to see the full error message
import LiquidityRewardsDistributor from '../abis/BoostedLiquidityDistributor.json'
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../abis/ERC20.json'. Consider ... Remove this comment to see the full error message
import ERC20 from '../abis/ERC20.json'
import { NumberType, transformNumber } from './numbers'
import {
  useBalance,
  useStaticCall,
  useContractRead,
  useContractWrite,
  useWagmiContractWrite,
} from './use-wagmi'

const contractParams = {
  addressOrName: lpRewardsContract,
  contractInterface: LiquidityRewardsDistributor.abi,
}

export function useLiquidityRewards({ nationPrice, poolValue, address }: any) {
  const { data: totalRewards, isLoading: totalRewardsLoading } =
    useContractRead(contractParams, 'totalRewards', {}, false)
  const months = 6

  const { data: unclaimedRewards, loading: unclaimedRewardsLoading } =
    useStaticCall({
      ...contractParams,
      methodName: 'claimRewards',
      defaultData: transformNumber(0, NumberType.bignumber),
      throwOnRevert: false, // assumes a reverted transaction means no claimable rewards
      skip: !address,
    })

  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  const { data: userDeposit, isLoading: userDepositLoading } = useContractRead(
    contractParams,
    'userDeposit',
    {
      args: [address],
      watch: true,
      enabled: address,
    }
  )

  const { data: totalDeposit, isLoading: totalDepositLoading } =
    useContractRead(contractParams, 'totalDeposit', {}, false)

  const { data: lpTokensSupply, isLoading: lpTokensSupplyLoading } =
    useContractRead(
      { addressOrName: balancerLPToken, contractInterface: ERC20.abi },
      'totalSupply',
      {},
      false
    )

  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  const { data: userBalance, isLoading: userBalanceLoading } = useContractRead(
    contractParams,
    'userBalance',
    {
      args: [address],
      watch: true,
      enabled: address,
    }
  )

  const [liquidityRewardsAPY, setLiquidityRewardsAPY] = useState(
    transformNumber(0, NumberType.bignumber)
  )

  useEffect(() => {
    if (totalRewards && poolValue && totalDeposit && lpTokensSupply) {
      setLiquidityRewardsAPY(
        totalRewards
          .mul(transformNumber(12 / months, NumberType.bignumber))
          .mul(transformNumber(nationPrice, NumberType.bignumber, 2))
          .div(poolValue.mul(totalDeposit).div(lpTokensSupply))
      )
    }
  }, [
    poolValue,
    totalDeposit,
    lpTokensSupply,
    nationPrice,
    totalRewards,
    totalRewardsLoading,
    totalDepositLoading,
    lpTokensSupplyLoading,
  ])

  return {
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
  }
}

export function usePoolTokenBalance(address: any) {
  return useBalance({
    addressOrName: address,
    token: balancerLPToken,
    watch: true,
    enabled: address,
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
}: any) {
  const [boost, setBoost] = useState({
    canBoost: false,
    currentBoost: {} as any,
    potentialBoost: {} as any,
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
        userDeposit: parseFloat(
          transformNumber(userDeposit, NumberType.string) as string
        ),
        totalDeposit: parseFloat(
          transformNumber(totalDeposit, NumberType.string) as string
        ),
        userVeNation: parseFloat(
          transformNumber(userVeNation, NumberType.string) as string
        ),
        totalVeNation: parseFloat(
          transformNumber(totalVeNation, NumberType.string) as string
        ),
        userBalance: parseFloat(
          transformNumber(userBalance, NumberType.string) as string
        ),
      }

      const baseBalance = n.userDeposit * 0.4

      let boostedBalance =
        baseBalance +
        ((n.totalDeposit * n.userVeNation) / n.totalVeNation) * (60 / 100)

      boostedBalance = Math.min(boostedBalance, n.userDeposit)

      const potentialBoost = boostedBalance / baseBalance

      boostedBalance = Math.min(boostedBalance, n.userDeposit)

      const currentBoost = n.userBalance / baseBalance

      console.log(`Current boost: ${currentBoost}`)
      console.log(`Potential boost: ${potentialBoost}`)
      setBoost({
        currentBoost: transformNumber(
          Math.max(currentBoost, 1),
          NumberType.bignumber
        ),
        potentialBoost: transformNumber(potentialBoost, NumberType.bignumber),
        canBoost:
          Math.trunc(potentialBoost * 10) > Math.trunc(currentBoost * 10),
      })
    }
  }, [userDeposit, totalDeposit, userVeNation, totalVeNation, userBalance])

  return boost
}

export function useBoostedAPY({ defaultAPY, boostMultiplier }: any) {
  const [apy, setAPY] = useState(
    parseFloat(transformNumber(defaultAPY, NumberType.string) as string)
  )
  useEffect(() => {
    if (!defaultAPY?.isZero() && !boostMultiplier?.isZero()) {
      setAPY(
        ((transformNumber(defaultAPY, NumberType.number) as number) /
          10 ** 18) *
          boostMultiplier
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

export function useDeposit(amount: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  return useContractWrite(contractParams, 'deposit', {
    args: [amount],
    overrides: { gasLimit: 300000 },
  })
}

export function useWithdraw(amount: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  return useContractWrite(contractParams, 'withdraw', {
    args: [amount],
  })
}

export function useWithdrawAndClaim() {
  return useWagmiContractWrite(contractParams, 'withdrawAndClaim', {
    overrides: { gasLimit: 300000 },
  })
}
