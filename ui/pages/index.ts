import Image from 'next/image'
import Link from 'next/link'
import { nationToken, veNationRewardsMultiplier } from '../lib/config'
import GradientLink from '../components/GradientLink'
import Head from '../components/Head'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../public/flag.svg' or its cor... Remove this comment to see the full error message
import flag from '../public/flag.svg'

export default function Index() {
  return (
    <>
      // @ts-expect-error ts-migrate(2749) FIXME: 'Head' refers to a value, but is being used as a t... Remove this comment to see the full error message
      <Head title="Home" />
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
      <div className="hero h-full">
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
        <div className="hero-content flex-col pb-24">
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h1'.
          <h1 className="card-title text-center text-3xl font-semibold mb-2">
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Welcome'.
            Welcome to Nation3
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'src'.
            <Image src={flag} width={36} height={36} />
          </h1>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'p'.
          <p className="max-w-sm mb-8">
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Nation3'.
            Nation3 is a sovereign cloud nation. We are building a community of
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'like'.
            like-minded people creating a nation on the cloud.{' '}
            // @ts-expect-error ts-migrate(2749) FIXME: 'GradientLink' refers to a value, but is being use... Remove this comment to see the full error message
            <GradientLink text="Read more" href="https://nation3.org" />
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'br'.
            <br />
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'br'.
            <br />
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Here'.
            Here you can perform on-chain operations related to the Nation3
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'communinity'.
            communinity, such as...
          </p>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
          <Link href="/claim">
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
            <a className="btn btn-lg btn-primary mb-1 normal-case font-medium">
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Claim'.
              Claim $NATION
            </a>
          </Link>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'p'.
          <p>and then...</p>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
          <div className="flex flex-col 2xl:flex-row mt-2 gap-8">
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
            <div className="card w-80 md:w-96 bg-base-100 shadow-md">
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
              <div className="card-body items-stretch items-center">
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h2'.
                <h2 className="card-title text-center font-medium">
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Get'.
                  Get $veNATION
                </h2>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'p'.
                <p>
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Lock'.
                  Lock your $NATION to obtain $veNATION and help govern the
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Nation3'.
                  Nation3 DAO. $veNATION will be required to mint the upcoming
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'passport'.
                  passport NFTs to become a citizen.
                </p>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'text'.
                <GradientLink text="Get $veNATION" href="/lock"></GradientLink>
              </div>
            </div>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
            <div className="card w-80 md:w-96 bg-base-100 shadow-md">
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
              <div className="card-body items-stretch items-center">
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h2'.
                <h2 className="card-title text-center font-medium">
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Earn'.
                  Earn LP rewards
                </h2>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'p'.
                <p>
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Provide'.
                  Provide liquidity in the{' '}
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
                  <a
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
                    href="https://app.balancer.fi/#/pool/0x0bf37157d30dfe6f56757dcadff01aed83b08cd600020000000000000000019a"
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'target'.
                    target="_blank"
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'rel'.
                    rel="noopener noreferrer"
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
                    className="text-n3blue"
                  >
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$NATION'.
                    80% $NATION / 20% $ETH Balancer pool
                  </a>{' '}
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'and'.
                  and earn liquidity rewards. Boost your APY by $
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'x'.
                  {veNationRewardsMultiplier}x by having $veNATION.
                </p>
                <GradientLink
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'text'.
                  text="Provide liquidity"
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
                  href="/liquidity"
                ></GradientLink>
              </div>
            </div>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
            <div className="card w-80 md:w-96 bg-base-100 shadow-md">
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
              <div className="card-body items-stretch items-center">
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h2'.
                <h2 className="card-title text-center font-medium">
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Buy'.
                  Buy more $NATION
                </h2>
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'p'.
                <p>
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'You'.
                  You can buy more $NATION and participate in liquidity rewards.
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'You'.
                  You can also lock your $NATION to get $veNATION to boost your
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'rewards'.
                  rewards, get a passport NFT, and govern the DAO.
                </p>
                <GradientLink
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'text'.
                  text="Buy $NATION"
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
                  href={`https://app.balancer.fi/#/trade/ether/${nationToken}`}
                // @ts-expect-error ts-migrate(2365) FIXME: Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
                ></GradientLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
