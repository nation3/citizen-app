import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { useRef, useEffect } from 'react'
import { nationToken, nationPassportNFTIssuer } from '../lib/config'
import { veNationRequiredStake } from '../lib/config'
import { useMintPassport } from '../lib/passport-nft'
import { useHasPassport } from '../lib/passport-nft'
import { useAccount } from '../lib/use-wagmi'
import { useVeNationBalance } from '../lib/ve-token'
import ActionButton from '../components/ActionButton'
import Balance from '../components/Balance'
import Confetti from '../components/Confetti'
import Head from '../components/Head'

export default function Join() {
  const [{ data: account }] = useAccount()
  const [{ data: balance, loading: balanceLoading }] = useVeNationBalance(
    account?.address
  )
  const [{ data: hasPassport, loading: hasPassportLoading }] = useHasPassport(
    account?.address
  )
  const mint = useMintPassport()

  const router = useRouter()

  const changeUrl = () => {
    router.replace('/join?mintingPassport=1', undefined, { shallow: true })
  }

  useEffect(() => {
    if (hasPassport) {
      setTimeout(() => {
        router.push('/citizen')
      }, 5000)
    }
  }, [hasPassport, hasPassportLoading])

  const elementRef = useRef()

  return (
    <>
      <Head title="Become a citizen" />
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
                      locking up {veNationRequiredStake} $NATION for a year and
                      renewing your stake over time. This is to make sure all
                      citizens are economically aligned.
                    </p>

                    <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
                      <div className="stat">
                        <div className="stat-title">Needed balance</div>
                        <div className="stat-value">
                          {veNationRequiredStake}
                        </div>
                        <div className="stat-desc">$veNATION</div>
                      </div>

                      <div className="stat">
                        <div className="stat-title">Your balance</div>
                        <div className="stat-value">
                          <Balance
                            loading={balanceLoading}
                            balance={
                              balance && ethers.utils.formatEther(balance)
                            }
                            decimals={2}
                          />
                        </div>
                        <div className="stat-desc">$veNATION</div>
                      </div>
                    </div>
                    {balance?.value < veNationRequiredStake ? (
                      <a className="btn btn-primary grow">Buy $NATION</a>
                    ) : (
                      <ActionButton
                        className="btn btn-primary grow"
                        action={mint}
                        preAction={changeUrl}
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
