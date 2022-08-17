import {
  UserAddIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  PlusIcon,
} from '@heroicons/react/outline'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { balancerDomain, balancerPoolId, nationToken, veNationRewardsMultiplier } from '../lib/config'
import GradientLink from '../components/GradientLink'
import Head from '../components/Head'
import HomeCard from '../components/HomeCard'
import flag from '../public/flag.svg'

export default function Index() {
  return (
    <>
      <Head title="Home" />
      <div className="flex flex-col max-w-3xl">
        <h1 className="card-title text-center text-3xl font-semibold mb-2">
          Welcome to Nation3
          <Image src={flag} width={36} height={36} />
        </h1>

        <p className="mb-8">
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

        <p className="text-center">and then...</p>

        <div className="grid xl:grid-cols-2 mt-2 gap-8">
          <HomeCard
            href="/lock"
            icon={
              <LockClosedIcon className="h-5 w-5 absolute right-8 text-n3blue" />
            }
            title="Get $veNATION"
            linkText="Get $veNATION"
          >
            <p>
              Lock your $NATION to obtain $veNATION and help govern the Nation3
              DAO. $veNATION will be required to mint the upcoming passport NFTs
              to become a citizen.
            </p>
          </HomeCard>

          <HomeCard
            href="/join"
            icon={
              <UserAddIcon className="h-5 w-5 absolute right-8 text-n3blue" />
            }
            title="Become a citizen"
            linkText="Claim a passport"
          >
            <p>
              Once you have $veNATION, you can claim a passport. Only 420
              Genesis passports will be launched in the beginning.
            </p>
          </HomeCard>

          <HomeCard
            href="/liquidity"
            icon={
              <CurrencyDollarIcon className="h-5 w-5 absolute right-8 text-n3blue" />
            }
            title="Earn LP rewards"
            linkText="Provide liquidity"
          >
            <p>
              Provide liquidity in the{' '}
              <a
                href={`${balancerDomain}/#/pool/${balancerPoolId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-n3blue"
              >
                80% $NATION / 20% $ETH Balancer pool
              </a>{' '}
              and earn liquidity rewards. Boost your APY by $
              {veNationRewardsMultiplier}x by having $veNATION.
            </p>
          </HomeCard>

          <HomeCard
            href={`${balancerDomain}/#/trade/ether/${nationToken}`}
            icon={<PlusIcon className="h-5 w-5 absolute right-8 text-n3blue" />}
            title="Buy more $NATION"
            linkText="Buy $NATION"
          >
            <p>
              You can buy more $NATION and participate in liquidity rewards. You
              can also lock your $NATION to get $veNATION to boost your rewards,
              get a passport NFT, and govern the DAO.
            </p>
          </HomeCard>
        </div>
      </div>
    </>
  )
}
