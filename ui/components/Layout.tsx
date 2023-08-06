import {
  ChevronDownIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  ArrowTopRightOnSquareIcon,
  HomeIcon,
  KeyIcon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  NewspaperIcon,
  PlusIcon,
  UserPlusIcon,
  UserIcon,
  Squares2X2Icon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useState } from 'react'
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import Blockies from 'react-blockies'
import { useConnect, useDisconnect, useEnsName } from 'wagmi'
import { balancerDomain, etherscanDomain, nationToken } from '../lib/config'
import { connectorIcons } from '../lib/connectors'
import { useAccount } from '../lib/use-wagmi'
import Logo from '../public/logo.svg'
import ErrorCard from './ErrorCard'
import { useErrorContext } from './ErrorProvider'
import PassportCheck from './PassportCheck'
import PreferredNetworkWrapper from './PreferredNetworkWrapper'

type Indexable = {
  [key: string]: any
}

const navigation = [
  {
    name: 'Start',
    href: '/',
    icon: <Squares2X2Icon className="h-5 w-5" />,
  },
  {
    name: 'Become a citizen',
    href: '/join',
    icon: <UserPlusIcon className="h-5 w-5" />,
  },
  {
    name: 'Lock tokens',
    href: '/lock',
    icon: <LockClosedIcon className="h-5 w-5" />,
  },
  {
    name: 'Liquidity rewards',
    href: '/liquidity',
    icon: <CurrencyDollarIcon className="h-5 w-5" />,
  },
  {
    name: 'Buy $NATION',
    href: `${balancerDomain}/#/ethereum/swap/ether/${nationToken}`,
    icon: <PlusIcon className="h-5 w-5" />,
  },
  {
    name: 'Homepage',
    href: 'https://nation3.org',
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    name: 'Docs',
    href: 'https://docs.nation3.org',
    icon: <NewspaperIcon className="h-5 w-5" />,
  },
]

export default function Layout({ children }: any) {
  const router = useRouter()
  const { connectors, connect, error: connectError } = useConnect()
  const { data: account } = useAccount()

  const { data: ensName } = useEnsName({ address: account?.address ?? '' })
  const { disconnect } = useDisconnect()
  const [nav, setNav] = useState(navigation)
  const errorContext = useErrorContext()

  const onPassportChecked = (hasPassport: boolean) => {
    if (hasPassport) {
      navigation[1].name = 'Welcome, citizen'
      navigation[1].href = '/citizen'
      setNav(navigation)
      if (router.pathname === '/join' && !router.query.mintingPassport) {
        router.push('/citizen')
      }
    } else {
      if (router.pathname === '/citizen') {
        router.push('/join')
      }
    }
  }

  const layout = (
    <div className="mx-auto bg-n3bg font-display">
      <Script src="https://cdn.splitbee.io/sb.js" />
      <div className="h-screen">
        <div className="navbar bg-base-100 border-slate-100 border-b-2 py-0 pl-0 lg:hidden sticky z-10">
          <div className="navbar-start border-slate-100 pl-0">
            <div className="w-80 border-slate-100 py-4 box-content">
              <div className="pl-6 pt-2 cursor-pointer">
                <div className="flex-none hidden lg:block">
                  <Link href="/" passHref>
                    <a>
                      <Image src={Logo} />
                    </a>
                  </Link>
                </div>
                <div className="flex-none lg:hidden">
                  <label
                    htmlFor="side-drawer"
                    className="btn btn-square btn-ghost"
                  >
                    <Bars3Icon className="h-8 w-8" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="drawer drawer-mobile">
          <input id="side-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content fixed top-0 left-0 right-0 bottom-0 lg:static pt-24 lg:pt-0 z-0 max-h-screen">
            <div className="flex flex-col w-full h-full">
              <PreferredNetworkWrapper>
                <div className="hero h-full">
                  <div className="hero-content">{children}</div>
                </div>
              </PreferredNetworkWrapper>
            </div>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="side-drawer"
              className="drawer-overlay z-10"
            ></label>
            <div className="bg-white w-80 flex flex-col justify-between pb-24 lg:pb-0 overflow-y-auto drop-shadow-md min-h-screen">
              <div className="mt-6 py-4 hidden lg:block">
                <div className="px-8 pt-2 cursor-pointer">
                  <Link href="/" passHref>
                    <a>
                      <Image src={Logo} />
                    </a>
                  </Link>
                </div>
              </div>
              <ul className="menu p-4 overflow-y-auto text-base-400 grow">
                {nav.map((item: any) => (
                  <li
                    className="mt-1 relative py-2"
                    onClick={() =>
                      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                      (document.getElementById('side-drawer').checked = false)
                    }
                    key={item.href}
                  >
                    {item.href.charAt(0) === '/' ? (
                      <Link href={item.href}>
                        <a
                          className={`py-4 ${
                            router.pathname == item.href ? 'active' : ''
                          }`}
                        >
                          {item.icon}
                          {item.name}
                          <ChevronRightIcon className="h-5 w-5 absolute right-4 opacity-50" />
                        </a>
                      </Link>
                    ) : (
                      <a
                        className={`py-4 ${
                          router.pathname == item.href ? 'active' : ''
                        }`}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.icon}
                        {item.name}
                        <ArrowTopRightOnSquareIcon className="h-5 w-5 absolute right-4 opacity-50" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <ul className="menu p-4 text-base-400">
                {account?.address ? (
                  <li>
                    <label htmlFor="web3-modal">
                      <div className="mask mask-circle cursor-pointer">
                        <Blockies seed={account?.address} size={12} />
                      </div>
                      {ensName
                        ? ensName
                        : `${((account.address as string) ?? '').substring(
                            0,
                            6
                          )}...${account.address.slice(-4)}`}
                      <ChevronDownIcon className="h-5 w-5 absolute right-4 opacity-50" />
                    </label>
                  </li>
                ) : (
                  <li>
                    <label
                      htmlFor="web3-modal"
                      className="btn btn-primary normal-case font-medium text-white modal-button"
                    >
                      Sign in
                    </label>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <input type="checkbox" id="web3-modal" className="modal-toggle" />

      <label htmlFor="web3-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <label
            htmlFor="web3-modal"
            className="btn btn-sm btn-circle btn-ghost absolute right-6 top-5"
          >
            ✕
          </label>

          {account ? (
            <>
              <h3 className="text-lg font-bold px-4">Account</h3>

              <p className="p-4">Connected to {account.connector?.name}</p>

              <ul className="menu bg-base-100 p-2 -m-2 rounded-box">
                <li key="address">
                  <a
                    href={`${etherscanDomain}/address/${account.address}`}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    <UserIcon className="h-5 w-5" />
                    {ensName
                      ? ensName
                      : `${((account.address as string) ?? '').substring(
                          0,
                          6
                        )}...${((account.address as string) ?? '').slice(-4)}`}
                  </a>
                </li>

                <li key="logout">
                  <a onClick={() => disconnect()}>
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Log out
                  </a>
                </li>
              </ul>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold px-4">
                Sign in by connecting your account
              </h3>

              <p className="p-4">You can choose from these providers:</p>
              {connectError ? (
                <div className="alert alert-error mb-4">
                  <div>
                    <XCircleIcon className="h-5 w-5" />
                    <span>{connectError?.message || 'Failed to connect'}</span>
                  </div>
                </div>
              ) : (
                ''
              )}

              <ul className="menu bg-base-100 p-2 -m-2 rounded-box">
                {connectors.map((connector) => (
                  <li key={connector.id}>
                    <button
                      disabled={!connector.ready}
                      onClick={() => connect({connector})}
                    >
                      {(connectorIcons as Indexable)[connector.name] ? (
                        <div className="h-5 w-5">
                          <Image
                            src={(connectorIcons as Indexable)[connector.name]}
                          />
                        </div>
                      ) : (
                        <KeyIcon className="h-5 w-5" />
                      )}
                      {connector.name}
                      {!connector.ready && ' (unsupported)'}
                    </button>
                  </li>
                ))}
              </ul>

              <p className="px-4 mt-4">
                New to Ethereum?{' '}
                <a
                  href="https://ethereum.org/wallets/"
                  rel="noreferrer noopener"
                  target="_blank"
                  className="underline text-n3blue"
                >
                  Learn more about wallets
                </a>
                .<br />
                <br />
                By using this software, you agree to{' '}
                <a
                  href="https://github.com/nation3/app/blob/main/LICENSE.md"
                  rel="noreferrer noopener"
                  target="_blank"
                  className="underline text-n3blue"
                >
                  its terms of use
                </a>
                .
              </p>
            </>
          )}
        </label>
      </label>
      {errorContext?.errors ? (
        <div className="fixed md:right-8 md:bottom-8 md:left-auto bottom-0 left-0 right-0">
          <div className="stack max-w-sm">
            {errorContext.errors.map((error: any) => (
              <ErrorCard error={error} key={error.key} />
            ))}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )

  if (account?.address) {
    return (
      <PassportCheck
        address={account.address}
        onPassportChecked={onPassportChecked}
      >
        {layout}
      </PassportCheck>
    )
  } else {
    return layout
  }
}
