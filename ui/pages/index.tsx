import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { nationToken, veNationRewardsMultiplier } from '../lib/config'
import GradientLink from '../components/GradientLink'
import Head from '../components/Head'
// @ts-expect-error
import flag from '../public/flag.svg'

export default function Index() {
  return (
    <>
      <Head title="Home" />

      <div className="hero h-full">
        <div className="hero-content flex-col pb-24">
          <h1 className="card-title text-center text-3xl font-semibold mb-2">
            Welcome to Nation3
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
                  Nation3 DAO. $veNATION will be required to mint the upcoming
                  passport NFTs to become a citizen.
                </p>

                <GradientLink text="Get $veNATION" href="/lock"></GradientLink>
              </div>
            </div>

            <div className="card w-80 md:w-96 bg-base-100 shadow-md">
              <div className="card-body items-stretch items-center">
                <h2 className="card-title text-center font-medium">
                  Earn LP rewards
                </h2>

                <p>
                  Provide liquidity in the{' '}
                  <a
                    href="https://app.balancer.fi/#/pool/0x0bf37157d30dfe6f56757dcadff01aed83b08cd600020000000000000000019a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-n3blue"
                  >
                    80% $NATION / 20% $ETH Balancer pool
                  </a>{' '}
                  and earn liquidity rewards. Boost your APY by $
                  {veNationRewardsMultiplier}x by having $veNATION.
                </p>
                <GradientLink
                  text="Provide liquidity"
                  href="/liquidity"
                ></GradientLink>
              </div>
            </div>

            <div className="card w-80 md:w-96 bg-base-100 shadow-md">
              <div className="card-body items-stretch items-center">
                <h2 className="card-title text-center font-medium">
                  Buy more $NATION
                </h2>

                <p>
                  You can buy more $NATION and participate in liquidity rewards.
                  You can also lock your $NATION to get $veNATION to boost your
                  rewards, get a passport NFT, and govern the DAO.
                </p>
                <GradientLink
                  text="Buy $NATION"
                  href={`https://app.balancer.fi/#/trade/ether/${nationToken}`}
                ></GradientLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
