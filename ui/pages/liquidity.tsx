import {
  TrendingUpIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  CalculatorIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import React from 'react'
import { useBalancerPool } from '../lib/balancer'
import {
  balancerPoolId,
  balancerLPToken,
  lpRewardsContract,
  veNationRewardsMultiplier,
  balancerDomain,
} from '../lib/config'
import {
  useLiquidityRewards,
  usePoolTokenBalance,
  useVeNationBoost,
  useBoostedAPY,
  useDeposit,
  useWithdraw,
  useWithdrawAndClaim,
  useClaimRewards,
} from '../lib/liquidity-rewards'
import { NumberType, transformNumber } from '../lib/numbers'
import { useAccount } from '../lib/use-wagmi'
import { useVeNationBalance, useVeNationSupply } from '../lib/ve-token'
import ActionButton from '../components/ActionButton'
import Balance from '../components/Balance'
import GradientLink from '../components/GradientLink'
import Head from '../components/Head'
import MainCard from '../components/MainCard'
import EthersInput from '../components/EthersInput'

export default function Liquidity() {
  const { data: account } = useAccount()

  const { data: veNationBalance, isLoading: veNationBalanceLoading } =
    useVeNationBalance(account?.address)
  const {
    poolValue,
    nationPrice,
    isLoading: poolLoading,
  } = useBalancerPool(balancerPoolId)

  const { data: poolTokenBalance, isLoading: poolTokenBalanceLoading } =
    usePoolTokenBalance(account?.address)

  const {
    liquidityRewardsAPY,
    unclaimedRewards,
    userDeposit,
    totalDeposit,
    userBalance,
    loading: liquidityRewardsLoading,
  } = useLiquidityRewards({
    nationPrice,
    poolValue,
    address: account?.address,
  })

  const { data: veNationSupply } = useVeNationSupply()

  const { currentBoost, potentialBoost, canBoost } = useVeNationBoost({
    userDeposit,
    totalDeposit,
    userVeNation: veNationBalance?.value,
    totalVeNation: veNationSupply,
    userBalance,
  })

  const boostedAPY = useBoostedAPY({
    defaultAPY: liquidityRewardsAPY,
    boostMultiplier: currentBoost,
  })

  const [depositValue, setDepositValue] = useState(0)
  const [withdrawalValue, setWithdrawalValue] = useState('0')
  const deposit = useDeposit(
    transformNumber(depositValue, NumberType.bignumber)
  )
  const withdraw = useWithdraw(
    transformNumber(withdrawalValue, NumberType.bignumber)
  )

  // @ts-expect-error
  const claimRewards = useClaimRewards(unclaimedRewards)
  const withdrawAndClaimRewards = useWithdrawAndClaim()
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <Head title="$NATION liquidity rewards" />

      <MainCard title="$NATION liquidity rewards">
        <p>
          Provide liquidity in the pool and then deposit the pool token here.{' '}
          <GradientLink
            href={`${balancerDomain}/#/pool/${balancerPoolId}`}
            text="Balancer pool"
            textSize="md"
          />
          <br />
          Get up to {veNationRewardsMultiplier}x more rewards with $veNATION.{' '}
          <GradientLink href="/lock" text="Get $veNATION" textSize="md" />
        </p>

        <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
          <div className="stat">
            <div className="stat-figure">
              <CurrencyDollarIcon className="h-8 w-8" />
            </div>

            <div className="stat-title">Total liquidity</div>

            <div className="stat-value">
              <Balance
                balance={
                  (transformNumber(poolValue, NumberType.number, 0) as number) /
                  1000000
                }
                loading={poolLoading}
                prefix="$"
                suffix="M"
                decimals={2}
              />
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure">
              <TrendingUpIcon className="h-8 w-8" />
            </div>

            <div className="stat-title">Rewards APY</div>

            <div className="stat-value">
              <Balance
                balance={liquidityRewardsAPY}
                loading={liquidityRewardsLoading}
                suffix="%"
                decimals={2}
              />
            </div>
          </div>
        </div>

        <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
          <div className="stat">
            <div className="stat-figure text-primary">
              <SparklesIcon className="h-8 w-8" />
            </div>

            <div className="stat-title">Your veNATION</div>

            <div className="stat-value text-primary">
              <Balance
                balance={veNationBalance?.value}
                loading={veNationBalanceLoading}
                decimals={4}
              />
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <CalculatorIcon className="h-8 w-8" />
            </div>

            <div className="stat-title">Your boosted APY</div>

            <div className="stat-value text-secondary">
              <Balance
                balance={boostedAPY || liquidityRewardsAPY}
                suffix="%"
                decimals={2}
              />
            </div>
          </div>
        </div>
        {canBoost && (
          <div className="alert mb-4">
            <div>
              <InformationCircleIcon className="h-8 w-8 text-n3blue" />

              <div>
                You can boost your APY to{' '}
                <span className="text-n3blue font-semibold">
                  {transformNumber(
                    ((transformNumber(
                      liquidityRewardsAPY ?? 0,
                      NumberType.number
                    ) as number) /
                      10 ** 18) *
                      potentialBoost,
                    NumberType.number,
                    2
                  ) + '%'}
                </span>
                . To do so, claim your current rewards.
              </div>
            </div>
          </div>
        )}

        <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <ActionButton
                className="btn btn-primary normal-case font-medium grow"
                action={claimRewards}
              >
                Claim
              </ActionButton>
            </div>

            <div className="stat-title">Your rewards</div>

            <div className="stat-value text-primary">
              <Balance balance={unclaimedRewards} decimals={4} />
            </div>

            <div className="stat-desc">NATION tokens</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow overflow-visible">
          <div className="card-body">
            <div className="tabs flex justify-center bg-white mb-4">
              <a
                className={`tab grow ${activeTab === 0 ? 'tab-active' : ''}`}
                onClick={() => setActiveTab(0)}
              >
                Stake
              </a>

              <a
                className={`tab grow ${activeTab === 1 ? 'tab-active' : ''}`}
                onClick={() => setActiveTab(1)}
              >
                Unstake
              </a>
            </div>

            <div className="form-control">
              {activeTab === 0 ? (
                <>
                  <p className="mb-4">
                    Available to deposit:{' '}
                    <Balance
                      balance={poolTokenBalance?.formatted}
                      loading={poolTokenBalanceLoading}
                    />{' '}
                    LP tokens
                  </p>

                  <div className="input-group">
                    <EthersInput
                      type="number"
                      placeholder="Amount"
                      className="input input-bordered w-full"
                      value={depositValue}
                      onChange={setDepositValue}
                    />

                    <button
                      className="btn btn-outline"
                      onClick={() =>
                        poolTokenBalance &&
                        setDepositValue(poolTokenBalance?.formatted)
                      }
                    >
                      Max
                    </button>
                  </div>

                  <div className="card-actions mt-4">
                    <ActionButton
                      className="btn btn-primary normal-case font-medium w-full"
                      action={deposit}
                      approval={{
                        token: balancerLPToken,
                        spender: lpRewardsContract,
                        amountNeeded: depositValue,
                        approveText: 'Approve LP token',
                      }}
                    >
                      Deposit
                    </ActionButton>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-4">
                    Available to withdraw: <Balance balance={userDeposit} /> LP
                    tokens
                  </p>

                  <div className="input-group">
                    <EthersInput
                      type="number"
                      placeholder="Amount"
                      className="input input-bordered w-full"
                      value={withdrawalValue}
                      onChange={(value: any) => {
                        setWithdrawalValue(value)
                      }}
                    />

                    <button
                      className="btn btn-outline"
                      onClick={() =>
                        userDeposit &&
                        setWithdrawalValue(
                          transformNumber(
                            userDeposit,
                            NumberType.string
                          ) as string
                        )
                      }
                    >
                      Max
                    </button>
                  </div>

                  <div className="card-actions mt-4">
                    <ActionButton
                      className="btn btn-primary normal-case font-medium w-full"
                      action={withdraw}
                    >
                      Withdraw
                    </ActionButton>

                    <ActionButton
                      className="btn btn-primary normal-case font-medium w-full"
                      action={withdrawAndClaimRewards}
                      preAction={() =>
                        userDeposit &&
                        setWithdrawalValue(
                          transformNumber(
                            userDeposit,
                            NumberType.string
                          ) as string
                        )
                      }
                    >
                      Withdraw all and claim
                      <div
                        className="tooltip tooltip-top md:tooltip-top flex items-center gap-2"
                        data-tip="This action will withdraw ALL of your tokens"
                      >
                        <InformationCircleIcon className="h-6 w-6 text-white pl-2" />
                      </div>
                    </ActionButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </MainCard>
    </>
  )
}
