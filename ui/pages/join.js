import { ethers } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef, useEffect, useState } from 'react'
import { nationToken, nationPassportNFTIssuer } from '../lib/config'
import { veNationRequiredStake } from '../lib/config'
import { useNationBalance } from '../lib/nation-token'
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
  const [{ data: nationBalance, loading: nationBalanceLoading }] =
    useNationBalance(account?.address)
  const [{ data: veNationBalance, loading: veNationBalanceLoading }] =
    useVeNationBalance(account?.address)
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
    setAction({
      mint: false,
      lockAndMint: true,
    })
  }, [
    nationBalance,
    nationBalanceLoading,
    veNationBalance,
    veNationBalanceLoading,
  ])

  const [lockTime, setLockTime] = useState({
    formatted: '1 year',
    value: 0,
    rangeValue: 0,
  })

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
                      having at least {veNationRequiredStake} $veNATION. This is
                      to make sure all citizens are economically aligned. Your
                      $veNATION won't be taken away from you — instead, you can
                      choose to withdraw them it when your lock expires.
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
                        action={mint}
                        preAction={changeUrl}
                      >
                        Mint
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
