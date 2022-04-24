import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef, useEffect, useState } from 'react'
import {
  nationToken,
} from '../lib/config'
import { useNationBalance } from '../lib/nation-token'
import { useAccount } from '../lib/use-wagmi'
import { useVeNationBalance } from '../lib/ve-token'
import GradientLink from '../components/GradientLink'
import Head from '../components/Head'
import flag from '../public/flag.svg'

export default function Index() {
  const router = useRouter()
  const [{ data: account }] = useAccount()
  const [{ data: nationBalance, loading: nationBalanceLoading }] =
    useNationBalance(account?.address)
  const [{ data: veNationBalance, loading: veNationBalanceLoading }] =
    useVeNationBalance(account?.address)

  const [fromTweetdrop, setFromTweetdrop] = useState(false)

  useEffect(() => {
    setFromTweetdrop(true)
  }, [router])

  const loading =
    nationBalanceLoading || veNationBalanceLoading

  return (
    <>
      <Head title="Tweetdrop" />
      <div className="hero h-full">
        <div className="hero-content flex-col pb-24">
          <h1 className="card-title text-center text-3xl font-semibold mb-2">
            {fromTweetdrop
              ? 'You are almost a genesis citizen of Nation3'
              : 'Welcome to Nation3'}
            <Image src={flag} width={36} height={36} />
          </h1>
          <p className="max-w-sm mb-8">
            Nation3 is a sovereign cloud nation. We are building a community of
            like-minded people creating a nation on the cloud.{' '}
            <GradientLink text="Read more" href="https://nation3.org" />
            <br />
            <br />
            Here you can perform on-chain operations related to the Nation3
            communinity, such as...
          </p>

          {!loading ? (
            <>
              <Link href="/claim">
                <a className="btn btn-lg btn-primary mb-1 normal-case font-medium">
                  Claim $NATION
                </a>
              </Link>
              <p>and then...</p>
              <div className="flex flex-col 2xl:flex-row mt-2 gap-8">
                <div className="card w-80 md:w-96 bg-base-100 shadow-md">
                  <div className="card-body items-stretch items-center">
                    <h2 className="card-title text-center font-medium">
                      Get $veNATION
                    </h2>
                    <p>
                      Lock your $NATION to obtain $veNATION and help govern the
                      Nation3 DAO. $veNATION will be required to mint the
                      upcoming passport NFTs and to boost liquidity rewards.
                    </p>
                    <GradientLink
                      text="Get $veNATION"
                      href="/lock"
                    ></GradientLink>
                  </div>
                </div>
                <div className="card w-80 md:w-96 bg-base-100 shadow-md">
                  <div className="card-body items-stretch items-center">
                    <h2 className="card-title text-center font-medium">
                      Buy more $NATION
                    </h2>
                    <p>
                      You can buy more $NATION and participate in liquidity
                      rewards. You can also lock your $NATION to get $veNATION,
                      allowing you to boost your rewards, get a passport NFT,
                      and govern the DAO.
                    </p>
                    <GradientLink
                      text="Buy $NATION"
                      href={`https://app.balancer.fi/#/trade/ether/${nationToken}`}
                    ></GradientLink>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex place-content-center">
              <button className="btn btn-square btn-ghost btn-disabled btn-lg bg-transparent loading"></button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
