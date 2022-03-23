import { useRouter } from 'next/router'
import React, { useRef, useEffect } from 'react'
import { nationToken, nationPassportNFTIssuer } from '../lib/config'
import { useNationBalance } from '../lib/nation-token'
import { useMintPassport } from '../lib/passport-nft'
import { useHasPassport } from '../lib/passport-nft'
import { useAccount } from '../lib/use-wagmi'
import ActionButton from '../components/ActionButton'
import Confetti from '../components/Confetti'
import LoadingBalance from '../components/LoadingBalance'

const requiredStake = process.env.NEXT_PUBLIC_NATION_REQUIRED_STAKE

export default function Join() {
  const [{ data: account }] = useAccount()
  const [{ data: balance, loading: balanceLoading }] = useNationBalance(
    account?.address
  )
  const [{ data: hasPassport, loading: hasPassportLoading }] = useHasPassport(
    account?.address
  )
  const [, mintPassport] = useMintPassport()

  const mint = () => {
    mintPassport()
    router.replace('/join?mintingPassport=1', undefined, { shallow: true })
  }

  const router = useRouter()
  useEffect(() => {
    if (hasPassport) {
      setTimeout(() => {
        router.push('/citizen')
      }, 5000)
    }
  }, [hasPassport])

  const elementRef = useRef()

  return (
    <>
      <div
        ref={elementRef}
        className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto relative"
      >
        {hasPassport && <Confetti elementRef={elementRef} />}
        <div className="hero-content">
          <div className="max-w-md">
            <div className="card w-80 md:w-96 bg-base-100 shadow-xl">
              <div className="card-body items-stretch items-center">
                <h2 className="card-title text-center">
                  Become a Nation3 citizen
                </h2>
                <ul className="steps steps-vertical lg:steps-horizontal my-8">
                  <li className={`step ${!hasPassport ? 'step-primary' : ''}`}>
                    Stake and mint
                  </li>
                  <li className={`step ${hasPassport ? 'step-primary' : ''}`}>
                    Adore your passport
                  </li>
                </ul>

                {!hasPassport ? (
                  <>
                    <p>
                      To become a citizen, you need to mint a passport NFT by
                      locking up {requiredStake} $NATION for a year and renewing
                      your stake over time. This is to make sure all citizens
                      are economically aligned.
                    </p>

                    <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
                      <div className="stat">
                        <div className="stat-title">Needed balance</div>
                        <div className="stat-value">{requiredStake}</div>
                        <div className="stat-desc">$NATION</div>
                      </div>

                      <div className="stat">
                        <div className="stat-title">Your balance</div>
                        <div className="stat-value">
                          <LoadingBalance
                            balanceLoading={balanceLoading}
                            balance={balance?.formatted}
                          />
                        </div>
                        <div className="stat-desc">$NATION</div>
                      </div>
                    </div>
                    {balance?.value < requiredStake ? (
                      <ActionButton className="btn btn-primary grow">
                        Buy $NATION
                      </ActionButton>
                    ) : (
                      <ActionButton
                        className="btn btn-primary grow"
                        onClick={mint}
                        approval={{
                          token: nationToken,
                          spender: nationPassportNFTIssuer,
                          amountNeeded: { formatted: '10' },
                          approveText: 'Approve $NATION',
                        }}
                      >
                        Stake and mint
                      </ActionButton>
                    )}
                  </>
                ) : (
                  <p>Welcome to the club</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
