import React, { useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import ActionNeedsAccount from '../components/ActionNeedsAccount'

export default function Liquidity() {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  const [activeTab, setActiveTab] = useState(0)
  return (
    <>
      <div class="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto">
        <div class="hero-content">
          <div class="max-w-md">
            <div class="card w-96 bg-base-100 shadow-xl">
              <div class="card-body items-stretch items-center">
                <h2 class="card-title text-center">
                  $NATION liquidity rewards
                </h2>
                <p>
                  Provide liquitity in this Balancer pool, then deposit the pool
                  token here.
                </p>

                <div class="stats stats-vertical lg:stats-horizontal shadow my-4">
                  <div class="stat">
                    <div class="stat-title">Current APY</div>
                    <div class="stat-value">500%</div>
                  </div>

                  <div class="stat">
                    <div class="stat-title">Total liquidity</div>
                    <div class="stat-value">$5M</div>
                  </div>
                </div>
                <div class="stats stats-vertical lg:stats-horizontal shadow mb-4">
                  <div class="stat">
                    <div class="stat-figure text-secondary">
                      <ActionNeedsAccount className="btn btn-primary grow">
                        Claim
                      </ActionNeedsAccount>
                    </div>
                    <div class="stat-title">Your rewards</div>
                    <div class="stat-value">203030</div>
                    <div class="stat-desc">NATION tokens</div>
                  </div>
                </div>
                <div class="card bg-base-100 shadow">
                  <div class="card-body">
                    <div class="tabs flex justify-center bg-white mb-4">
                      <a
                        class={`tab grow ${
                          activeTab === 0 ? 'tab-active' : ''
                        }`}
                        onClick={() => setActiveTab(0)}
                      >
                        Stake
                      </a>
                      <a
                        class={`tab grow ${
                          activeTab === 1 ? 'tab-active' : ''
                        }`}
                        onClick={() => setActiveTab(1)}
                      >
                        Unstake
                      </a>
                    </div>

                    <div class="form-control">
                      {activeTab === 0 ? (
                        <>
                          <p className="mb-4">Available to stake: 0 NATION</p>
                          <div class="input-group">
                            <input
                              type="text"
                              placeholder="Amount"
                              className="input input-bordered w-full"
                            />
                            <button class="btn btn-outline">Max</button>
                          </div>
                          <div class="card-actions mt-4">
                            <ActionNeedsAccount className="btn btn-primary w-full">
                              Stake
                            </ActionNeedsAccount>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mb-4">Available to unstake: 0 NATION</p>
                          <div class="input-group">
                            <input
                              type="text"
                              placeholder="Amount"
                              className="input input-bordered w-full"
                            />
                            <button class="btn btn-outline">Max</button>
                          </div>
                          <div class="card-actions mt-4">
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
