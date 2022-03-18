import React, { useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import ActionNeedsAccount from '../components/ActionNeedsAccount'

export default function Citizen() {
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
                <h2 class="card-title text-center">Become a Nation3 citizen</h2>
                <ul class="steps steps-vertical lg:steps-horizontal my-8">
                  <li class="step step-primary">Stake and mint</li>
                  <li class="step">Adore your passport</li>
                </ul>
                <p>
                  To become a citizen, you need to mint a passport NFT by
                  locking up 10 $NATION for a year. This is to make sure all
                  citizens are economically aligned.
                </p>

                <div class="stats stats-vertical lg:stats-horizontal shadow my-4">
                  <div class="stat">
                    <div class="stat-title">Needed balance</div>
                    <div class="stat-value">10</div>
                    <div class="stat-desc">$NATION</div>
                  </div>

                  <div class="stat">
                    <div class="stat-title">Your balance</div>
                    <div class="stat-value">5</div>
                    <div class="stat-desc">$NATION</div>
                  </div>
                </div>
                <ActionNeedsAccount className="btn btn-primary grow">
                  Buy $NATION
                </ActionNeedsAccount>
                <ActionNeedsAccount className="btn btn-primary btn-disabled grow">
                  Stake and mint
                </ActionNeedsAccount>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
