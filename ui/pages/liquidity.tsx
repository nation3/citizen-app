import { InformationCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { useBalancerPool } from '../lib/balancer'
import { balancerPoolId } from '../lib/config'
import {
  useLiquidityRewards,
  useWithdrawAndClaim,
} from '../lib/liquidity-rewards'
import { useAccount } from '../lib/use-wagmi'
import ActionButton from '../components/ActionButton'
import Balance from '../components/Balance'
import Head from '../components/Head'
import MainCard from '../components/MainCard'

export default function Liquidity() {
  const { address } = useAccount()

  const {
    poolValue,
    nationPrice,
    isLoading: poolLoading,
  } = useBalancerPool(balancerPoolId)

  const {
    unclaimedRewards,
    userDeposit,
    loading: liquidityRewardsLoading,
  } = useLiquidityRewards({
    nationPrice,
    poolValue,
    address,
  })

  const withdrawAndClaimRewards = useWithdrawAndClaim()

  return (
    <>
      <Head title="$NATION liquidity rewards" />

      <MainCard title="$NATION liquidity rewards">
        <p>Our liquidity rewards program is over.</p>
        <p>
          Please{' '}
          <span className="font-semibold">
            withdraw your LP tokens and rewards
          </span>{' '}
          as soon as possible.
        </p>
        <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
          <div className="stat">
            <div className="stat-title">Your stake</div>

            <div className="stat-value text-primary">
              <Balance balance={userDeposit} decimals={4} />
            </div>

            <div className="stat-desc">LP tokens</div>
          </div>
          <div className="stat">
            <div className="stat-title">Your rewards</div>

            <div className="stat-value text-primary">
              <Balance balance={unclaimedRewards} decimals={4} />
            </div>

            <div className="stat-desc">NATION tokens</div>
          </div>
        </div>
        <ActionButton
          className="btn btn-primary normal-case font-medium w-full"
          action={withdrawAndClaimRewards}
        >
          Withdraw all and claim
          <div
            className="tooltip tooltip-top md:tooltip-top flex items-center gap-2"
            data-tip="This action will withdraw ALL of your tokens"
          >
            <InformationCircleIcon className="h-6 w-6 text-white pl-2" />
          </div>
        </ActionButton>
      </MainCard>
    </>
  )
}
