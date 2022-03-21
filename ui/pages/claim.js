import { useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import { useNationBalance } from '../lib/nation-token'
import ActionButton from '../components/ActionButton'
import Confetti from '../components/Confetti'
import LoadingBalance from '../components/LoadingBalance'

export default function Claim() {
  const [{ data: accountData }] = useAccount()
  const [{ balanceData, balanceLoading }] = useNationBalance(
    accountData?.address
  )
  const [claimed, setClaimed] = useState(false)

  const elementRef = useRef()

  return (
    <>
      <div
        ref={elementRef}
        className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto relative"
      >
        {claimed && <Confetti elementRef={elementRef} />}
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
                      <ActionButton
                        className="btn btn-primary grow"
                        onClick={() => setClaimed(true)}
                      >
                        Claim
                      </ActionButton>
                    </div>
                    <div className="stat-title">Your claimable</div>
                    <div className="stat-value">
                      <LoadingBalance
                        balanceLoading={balanceLoading}
                        balanceData={balanceData?.formatted}
                      />
                    </div>
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
