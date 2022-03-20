import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { useNationBalance } from '../lib/nationToken'
import ActionNeedsAccount from '../components/ActionNeedsAccount'
import LoadingBalance from '../components/LoadingBalance'

export default function Liquidity() {
  const [{ data: accountData }] = useAccount()
  const { balanceData, balanceLoading } = useNationBalance(accountData?.address)

  const [activeTab, setActiveTab] = useState(0)
  return (
    <>
      <div className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto">
        <div className="hero-content">
          <div className="max-w-md">
            <div className="card md:w-96 bg-base-100 shadow-xl">
              <div className="card-body items-stretch items-center">
                <h2 className="card-title text-center">
                  $NATION liquidity rewards
                </h2>
                <p>
                  Provide liquitity in this Balancer pool, then deposit the pool
                  token here.
                </p>

                <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
                  <div className="stat">
                    <div className="stat-title">Current APY</div>
                    <div className="stat-value">500%</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Total liquidity</div>
                    <div className="stat-value">$5M</div>
                  </div>
                </div>
                <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <ActionNeedsAccount className="btn btn-primary grow">
                        Claim
                      </ActionNeedsAccount>
                    </div>
                    <div className="stat-title">Your rewards</div>
                    <div className="stat-value">203030</div>
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
                            Available to stake:{' '}
                            <LoadingBalance
                              balanceLoading={balanceLoading}
                              balanceData={balanceData}
                            />{' '}
                            NATION
                          </p>
                          <div className="input-group">
                            <input
                              type="text"
                              placeholder="Amount"
                              className="input input-bordered w-full"
                            />
                            <button className="btn btn-outline">Max</button>
                          </div>
                          <div className="card-actions mt-4">
                            <ActionNeedsAccount className="btn btn-primary w-full">
                              Stake
                            </ActionNeedsAccount>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mb-4">Available to unstake: 0 NATION</p>
                          <div className="input-group">
                            <input
                              type="text"
                              placeholder="Amount"
                              className="input input-bordered w-full"
                            />
                            <button className="btn btn-outline">Max</button>
                          </div>
                          <div className="card-actions mt-4">
                            <ActionNeedsAccount className="btn btn-primary w-full">
                              Unstake
                            </ActionNeedsAccount>
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
      </div>
    </>
  )
}
