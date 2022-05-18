import { useState, useEffect } from 'react'
import { lpRewardsContract, balancerLPToken } from '../lib/config'
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../abis/BoostedLiquidityDistri... Remove this comment to see the full error message
import LiquidityRewardsDistributor from '../abis/BoostedLiquidityDistributor.json'
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../abis/ERC20.json'. Consider ... Remove this comment to see the full error message
import ERC20 from '../abis/ERC20.json'
import { transformNumber } from './numbers'
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
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
      defaultData: transformNumber(0, 'bignumber'),
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
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
    transformNumber(0, 'bignumber')
  )

  useEffect(() => {
    if (totalRewards && poolValue && totalDeposit && lpTokensSupply) {
      setLiquidityRewardsAPY(
        totalRewards
          // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
          .mul(transformNumber(12 / months, 'bignumber'))
          .mul(transformNumber(nationPrice, 'bignumber', 2))
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
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | number | BigNumber | un... Remove this comment to see the full error message
        userDeposit: parseFloat(transformNumber(userDeposit, 'number', 18)),
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | number | BigNumber | un... Remove this comment to see the full error message
        totalDeposit: parseFloat(transformNumber(totalDeposit, 'number', 18)),
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | number | BigNumber | un... Remove this comment to see the full error message
        userVeNation: parseFloat(transformNumber(userVeNation, 'number', 18)),
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | number | BigNumber | un... Remove this comment to see the full error message
        totalVeNation: parseFloat(transformNumber(totalVeNation, 'number', 18)),
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | number | BigNumber | un... Remove this comment to see the full error message
        userBalance: parseFloat(transformNumber(userBalance, 'number', 18)),
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

export function useBoostedAPY({ defaultAPY, boostMultiplier }: any) {
  const [apy, setAPY] = useState(
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | number | BigNumber | un... Remove this comment to see the full error message
    parseFloat(transformNumber(defaultAPY, 'number', 2))
  )
  useEffect(() => {
    if (!defaultAPY?.isZero() && !boostMultiplier?.isZero()) {
      setAPY(
        // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
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
