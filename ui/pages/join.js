import { ethers } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef, useEffect, useState } from 'react'
import { veNationRequiredStake } from '../lib/config'
import { useNationBalance } from '../lib/nation-token'
import { useClaimPassport } from '../lib/passport-nft'
import { useHasPassport } from '../lib/passport-nft'
import { useAccount } from '../lib/use-wagmi'
import { useVeNationBalance } from '../lib/ve-token'
import ActionButton from '../components/ActionButton'
import Balance from '../components/Balance'
import Confetti from '../components/Confetti'
import Head from '../components/Head'

export default function Join() {
  const [{ data: account }] = useAccount()
  const [{ data: nationBalance, loading: nationBalanceLoading }] =
    useNationBalance(account?.address)
  const [{ data: veNationBalance, loading: veNationBalanceLoading }] =
    useVeNationBalance(account?.address)
  const [{ data: hasPassport, loading: hasPassportLoading }] = useHasPassport(
    account?.address
  )
  const claim = useClaimPassport()

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

  const [action, setAction] = useState({})

  useEffect(() => {
    if (!nationBalance || !veNationBalance) return
    setAction({
      mint: veNationBalance.gte(
        ethers.utils.parseEther(veNationRequiredStake.toString())
      ),
      lockAndMint: nationBalance.value
        .mul(4)
        .gte(ethers.utils.parseEther((veNationRequiredStake / 4).toString())),
    })
  }, [
    nationBalance,
    nationBalanceLoading,
    veNationBalance,
    veNationBalanceLoading,
  ])

  const loading =
    nationBalanceLoading || veNationBalanceLoading || hasPassportLoading

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
                  <li
                    className={`step text-sm ${
                      action.mint ? 'step-primary' : ''
                    }`}
                  >
                    Lock $NATION
                  </li>
                  <li
                    className={`step text-sm ${
                      action.mint && !hasPassport ? 'step-primary' : ''
                    }`}
                  >
                    Claim passport
                  </li>
                  <li
                    className={`step text-sm ${
                      hasPassport ? 'step-primary' : ''
                    }`}
                  >
                    Adore your passport
                  </li>
                </ul>

                {!hasPassport ? (
                  <>
                    <p>
                      To become a citizen, you need to mint a passport NFT by
                      holding at least {veNationRequiredStake} $veNATION. This
                      is to make sure all citizens are economically aligned
                      <br />
                      <br />
                      Your $veNATION won't be taken away from you. When your
                      lock expires, you can either withdraw them or increase the
                      lock to keep citizenship.
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
                            loading={veNationBalanceLoading}
                            balance={
                              veNationBalance &&
                              ethers.utils.formatEther(veNationBalance)
                            }
                            decimals={2}
                          />
                        </div>
                        <div className="stat-desc">$veNATION</div>
                      </div>
                    </div>
                    {action.mint ? (
                      <ActionButton
                        className="btn btn-primary grow"
                        action={claim}
                        preAction={changeUrl}
                      >
                        Claim
                      </ActionButton>
                    ) : action.lockAndMint ? (
                      <>
                        <Link href="/lock">
                          <button className="btn btn-primary grow">
                            Lock $NATION
                          </button>
                        </Link>
                      </>
                    ) : (
                      <a className="btn btn-primary grow">Buy $NATION</a>
                    )}
                  </>
                ) : (
                  <>
                    <p>
                      We are honored to welcome you to Nation3 as a fellow
                      citizen. You will be taken to your passport in a few
                      seconds ✨
                    </p>
                    <div className="flex place-content-center">
                      <button className="btn btn-square btn-ghost btn-disabled btn-lg bg-transparent loading"></button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
