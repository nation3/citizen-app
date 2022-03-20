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
      <div className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto">
        <div className="hero-content">
          <div className="max-w-md">
            <div className="card md:w-96 bg-base-100 shadow-xl">
              <div className="card-body items-stretch items-center">
                <h2 className="card-title text-center">
                  Become a Nation3 citizen
                </h2>
                <ul className="steps steps-vertical lg:steps-horizontal my-8">
                  <li className="step step-primary">Stake and mint</li>
                  <li className="step">Adore your passport</li>
                </ul>
                <p>
                  To become a citizen, you need to mint a passport NFT by
                  locking up 10 $NATION for a year. This is to make sure all
                  citizens are economically aligned.
                </p>

                <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
                  <div className="stat">
                    <div className="stat-title">Needed balance</div>
                    <div className="stat-value">10</div>
                    <div className="stat-desc">$NATION</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Your balance</div>
                    <div className="stat-value">5</div>
                    <div className="stat-desc">$NATION</div>
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
