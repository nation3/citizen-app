import { ethers } from 'ethers'
import { useState } from 'react'
import { useBalancerPool } from '../lib/balancer'
import {
  balancerPoolId,
  balancerLPToken,
  nationRewardsContract,
} from '../lib/config'
import {
  useLiquidityRewards,
  usePoolTokenBalance,
  useDeposit,
  useWithdraw,
  useWithdrawAndClaim,
  useClaimRewards,
} from '../lib/liquidity-rewards'
import { useAccount } from '../lib/use-wagmi'
import ActionButton from '../components/ActionButton'
import Balance from '../components/Balance'
import GradientLink from '../components/GradientLink'
import Head from '../components/Head'

export default function Liquidity() {
  const [{ data: account }] = useAccount()

  const [{ poolValue, nationPrice, loadingPool }] =
    useBalancerPool(balancerPoolId)
  const [{ data: poolTokenBalance, loading: poolTokenBalanceLoading }] =
    usePoolTokenBalance(account?.address)

  const [
    {
      liquidityRewardsAPY,
      unclaimedRewards,
      stakingBalance,
      loading: loadingLiquidityRewards,
    },
  ] = useLiquidityRewards({
    nationPrice,
    poolValue,
    address: account?.address,
  })
  const [depositValue, setDepositValue] = useState()
  const [withdrawalValue, setWithdrawalValue] = useState()
  const deposit = useDeposit(
    ethers.utils.parseEther(depositValue ? depositValue.toString() : '0')
  )
  const withdraw = useWithdraw(
    ethers.utils.parseEther(withdrawalValue ? withdrawalValue.toString() : '0')
  )
  const claimRewards = useClaimRewards(unclaimedRewards)
  const withdrawAndClaimRewards = useWithdrawAndClaim()
  const [activeTab, setActiveTab] = useState(0)

  const loading =
    loadingPool || poolTokenBalanceLoading || loadingLiquidityRewards

  return (
    <>
      <Head title="$NATION liquidity rewards" />

      <div className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto">
        {!loading ? (
          <div className="hero-content">
            <div className="max-w-md">
              <div className="card w-80 md:w-96 bg-base-100 shadow-xl">
                <div className="card-body items-stretch items-center">
                  <h2 className="card-title text-center">
                    $NATION liquidity rewards
                  </h2>
                  <p>
                    Provide liquitity in the pool and then deposit the pool
                    token here.{' '}
                    <GradientLink href="#" text="Balancer pool" textSize="md" />
                  </p>

                  <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
                    <div className="stat">
                      <div className="stat-title">Current APY</div>
                      <div className="stat-value">
                        <Balance
                          balance={liquidityRewardsAPY}
                          suffix="%"
                          decimals={0}
                        />
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-title">Total liquidity</div>
                      <div className="stat-value">
                        <Balance
                          balance={poolValue / 1000000}
                          prefix="$"
                          suffix="M"
                          decimals={2}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                    <div className="stat">
                      <div className="stat-figure text-secondary">
                        <ActionButton
                          className="btn btn-primary grow"
                          action={claimRewards}
                        >
                          Claim
                        </ActionButton>
                      </div>
                      <div className="stat-title">Your rewards</div>
                      <div className="stat-value">
                        <Balance balance={unclaimedRewards} decimals={2} />
                      </div>
                      <div className="stat-desc">NATION tokens</div>
                    </div>
                  </div>
                  <div className="card bg-base-100 shadow">
                    <div className="card-body">
                      <div className="tabs flex justify-center bg-white mb-4">
                        <a
                          className={`tab grow ${
                            activeTab === 0 ? 'tab-active' : ''
                          }`}
                          onClick={() => setActiveTab(0)}
                        >
                          Stake
                        </a>
                        <a
                          className={`tab grow ${
                            activeTab === 1 ? 'tab-active' : ''
                          }`}
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
                              <Balance balance={poolTokenBalance?.formatted} />{' '}
                              LP tokens
                            </p>
                            <div className="input-group">
                              <input
                                type="number"
                                placeholder="Amount"
                                className="input input-bordered w-full"
                                value={depositValue}
                                onChange={(e) => {
                                  setDepositValue(e.target.value)
                                }}
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
                                className="btn btn-primary w-full"
                                action={deposit}
                                approval={{
                                  token: balancerLPToken,
                                  spender: nationRewardsContract,
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
                              Available to withdraw:{' '}
                              <Balance balance={stakingBalance?.toString()} />{' '}
                              LP tokens
                            </p>
                            <div className="input-group">
                              <input
                                type="number"
                                placeholder="Amount"
                                className="input input-bordered w-full"
                                value={withdrawalValue}
                                onChange={(e) => {
                                  setWithdrawalValue(e.target.value)
                                }}
                              />
                              <button
                                className="btn btn-outline"
                                onClick={() =>
                                  stakingBalance &&
                                  setWithdrawalValue(stakingBalance)
                                }
                              >
                                Max
                              </button>
                            </div>
                            <div className="card-actions mt-4">
                              <ActionButton
                                className="btn btn-primary w-full"
                                action={withdraw}
                              >
                                Withdraw
                              </ActionButton>
                              <ActionButton
                                className="btn btn-primary w-full"
                                action={withdrawAndClaimRewards}
                              >
                                Withdraw all and claim
                              </ActionButton>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button className="btn btn-square btn-ghost btn-disabled bg-transparent loading"></button>
        )}
      </div>
    </>
  )
}
