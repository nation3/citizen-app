import { useRef, useState } from 'react'
import { useNationBalance } from '../lib/nation-token'
import { useAccount } from '../lib/use-wagmi'
import ActionButton from '../components/ActionButton'
import Confetti from '../components/Confetti'
import Head from '../components/Head'
import LoadingBalance from '../components/LoadingBalance'

export default function Claim() {
  const [{ data: account }] = useAccount()
  const [{ data: balance, loading: balanceLoading }] = useNationBalance(
    account?.address
  )
  const [claimed, setClaimed] = useState(false)

  const elementRef = useRef()

  return (
    <>
      <Head title="Claim your $NATION" />
      <div
        ref={elementRef}
        className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto relative"
      >
        {claimed && <Confetti elementRef={elementRef} />}
        <div className="hero-content">
          <div className="max-w-md">
            <div className="card w-80 md:w-96 bg-base-100 shadow-xl">
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
                    <div className="stat-value">5</div>
                    <div className="stat-desc">$NATION</div>
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
