import {
  SparklesIcon,
  HomeIcon,
  NewspaperIcon,
  KeyIcon,
  UserIcon,
  LogoutIcon,
  XCircleIcon,
  MenuIcon,
  LockClosedIcon,
  PlusIcon,
  ViewGridIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
} from '@heroicons/react/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useState, useEffect } from 'react'
import Blockies from 'react-blockies'
import { useConnect, useEnsName, useDisconnect } from 'wagmi'
import { nationToken } from '../lib/config'
import { connectorIcons } from '../lib/connectors'
import { useAccount } from '../lib/use-wagmi'
import Logo from '../public/logo.svg'
import ErrorCard from './ErrorCard'
import { useErrorContext } from './ErrorProvider'

const navigation = [
  {
    name: 'Start',
    href: '/',
    icon: <ViewGridIcon className="h-5 w-5" />,
  },
  /*{
    name: 'Become a citizen',
    href: '/join',
    icon: <UserAddIcon className="h-5 w-5" />,
  },*/
  {
    name: 'Claim airdrop',
    href: '/claim',
    icon: <SparklesIcon className="h-5 w-5" />,
  },
  {
    name: 'Lock tokens',
    href: '/lock',
    icon: <LockClosedIcon className="h-5 w-5" />,
  },
  /*{
    name: 'Liquidity rewards',
    href: '/liquidity',
    icon: <CurrencyDollarIcon className="h-5 w-5" />,
  },*/
  {
    name: 'Buy $NATION',
    href: `https://app.balancer.fi/#/trade/ether/${nationToken}`,
    icon: <PlusIcon className="h-5 w-5" />,
  },
  {
    name: 'Homepage',
    href: 'https://nation3.org',
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    name: 'Wiki',
    href: 'https://wiki.nation3.org',
    icon: <NewspaperIcon className="h-5 w-5" />,
  },
]

export default function Layout({ children }) {
  const router = useRouter()
  const { connectors, connectAsync, error: connectError } = useConnect()
  const { data: ensName } = useEnsName()
  const { disconnect } = useDisconnect() 
  const [nav, setNav] = useState(navigation)
  const errorContext = useErrorContext()
  const [account, setAccount] = useState('')
  // because of the useAccount doesn't rerender on account change, so use useEffect to update account
  const [{ data }] =  useAccount()
  useEffect(() => {
    setAccount(data)
  }, [data])

  return (
    <div className="mx-auto bg-n3bg font-display">
      <Script src="https://cdn.splitbee.io/sb.js" />
      <div className="flex flex-col h-screen">
        <div className="navbar bg-base-100 border-slate-100 border-b-2 py-0 pl-0 lg:hidden">
          <div className="navbar-start border-slate-100 pl-0">
            <div className="w-80 border-slate-100 py-4 box-content">
              <div className="pl-6 pt-2 cursor-pointer">
                <div className="flex-none hidden lg:block">
                  <Link href="/" passHref>
                    <Image src={Logo} />
                  </Link>
                </div>
                <div className="flex-none lg:hidden">
                  <label
                    htmlFor="side-drawer"
                    className="btn btn-square btn-ghost"
                  >
                    <MenuIcon className="h-8 w-8" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="drawer drawer-mobile w-full h-full grow max-h-screen flex-1">
          <input id="side-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col overflow-auto">
            {children}
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
                    <Image src={Logo}></Image>
                  </Link>
                </div>
              </div>
              <ul className="menu p-4 overflow-y-auto text-base-400 grow">
                {nav.map((item) => (
                  <li
                    className="mt-1 relative py-2"
                    onClick={() =>
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
                        <ExternalLinkIcon className="h-5 w-5 absolute right-4 opacity-50" />
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
                        : `${account.address.substring(
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
                    href={`https://etherscan.io/address/${account.address}`}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    <UserIcon className="h-5 w-5" />
                    {ensName
                      ? ensName
                      : `${account.address.substring(
                          0,
                          6
                        )}...${account.address.slice(-4)}`}
                  </a>
                </li>
                <li key="logout">
                  <a onClick={disconnect}>
                    <LogoutIcon className="h-5 w-5" />
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
                    <a
                      disabled={!connector.ready}
                      onClick={() => connectAsync(connector)}
                    >
                      {connectorIcons[connector.name] ? (
                        <div className="h-5 w-5">
                          <Image src={connectorIcons[connector.name]} />
                        </div>
                      ) : (
                        <KeyIcon className="h-5 w-5" />
                      )}
                      {connector.name}
                      {!connector.ready && ' (unsupported)'}
                    </a>
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
                  href="https://github.com/nation3/app/blob/master/LICENSE.md"
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
            {errorContext.errors.map((error) => (
              <ErrorCard error={error} key={error.key} />
            ))}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
