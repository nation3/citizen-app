import React, { useState, useEffect, useRef } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize, useTimeout } from 'react-use'
import { useAccount, useConnect } from 'wagmi'
import ActionNeedsAccount from '../components/ActionNeedsAccount'

export default function Claim() {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  const [claimed, setClaimed] = useState(false)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const elementRef = useRef()
  const [isComplete] = useTimeout(5000)

  useEffect(() => {
    setWidth(elementRef.current.offsetWidth)
    setHeight(elementRef.current.offsetHeight)
  }, [])

  return (
    <>
      <div
        ref={elementRef}
        className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto"
      >
        {claimed && (
          <Confetti width={width} height={height} recycle={!isComplete()} />
        )}
        <div className="hero-content">
          <div className="max-w-md">
            <div className="card md:w-96 bg-base-100 shadow-xl">
              <div className="card-body items-stretch items-center">
                <h2 className="card-title text-center">$NATION tweetdrop</h2>
                <p>
                  If you have participated in the $NATION tweetdrop, you can
                  claim here. If not, you can buy $NATION.
                </p>

                <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <ActionNeedsAccount
                        className="btn btn-primary grow"
                        onClick={() => setClaimed(true)}
                      >
                        Claim
                      </ActionNeedsAccount>
                    </div>
                    <div className="stat-title">Your claimable</div>
                    <div className="stat-value">5</div>
                    <div className="stat-desc">NATION tokens</div>
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
