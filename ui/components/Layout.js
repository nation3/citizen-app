import {
  UserAddIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  HomeIcon,
  NewspaperIcon,
  KeyIcon,
  UserIcon,
  LogoutIcon,
  XCircleIcon,
  MenuIcon,
} from '@heroicons/react/outline'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Blockies from 'react-blockies'
import { useConnect } from 'wagmi'
import { connectorIcons } from '../lib/connectors'
import { useHasPassport } from '../lib/passport-nft'
import { useHandleError } from '../lib/use-handle-error'
import { useAccount } from '../lib/use-wagmi'
import Logo from '../public/logo.svg'
import ErrorCard from './ErrorCard'
import { useErrorContext } from './ErrorProvider'

const navigation = [
  {
    name: 'Become a citizen',
    href: '/join',
    icon: <UserAddIcon className="h-5 w-5" />,
  },
  {
    name: 'Claim airdrop',
    href: '/claim',
    icon: <SparklesIcon className="h-5 w-5" />,
  },
  {
    name: 'Liquidity rewards',
    href: '/liquidity',
    icon: <CurrencyDollarIcon className="h-5 w-5" />,
  },
  {
    name: 'Divider',
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
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data: account }, disconnect] = useHandleError(
    useAccount({
      fetchEns: true,
    })
  )
  const [{ data: hasPassport, loading: hasPassportLoading }] = useHasPassport(
    account?.address
  )

  const [nav, setNav] = useState(navigation)

  const errorContext = useErrorContext()

  useEffect(() => {
    if (!hasPassportLoading) {
      if (hasPassport) {
        navigation[0].name = 'Welcome citizen'
        navigation[0].href = '/citizen'
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
  }, [hasPassport, hasPassportLoading, router.pathname])

  return (
    <div className="mx-auto">
      <div className="flex flex-col h-screen">
        <div className="navbar bg-base-100 border-slate-100 border-b-2 py-0 pl-0">
          <div className="navbar-start border-slate-100 pl-0">
            <div className="w-80 border-slate-100 lg:border-r-2 py-4 box-content">
              <div className="pl-6 pt-2 cursor-pointer">
                <div className="flex-none hidden lg:block">
                  <Link href="/">
                    <Image src={Logo}></Image>
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
          <div className="navbar-end pr-4">
            {account ? (
              <label
                htmlFor="web3-modal"
                className="mask mask-circle cursor-pointer"
              >
                <Blockies seed={account?.address} size={12} />
              </label>
            ) : (
              <label
                htmlFor="web3-modal"
                className="btn btn-primary text-white modal-button"
              >
                Sign in
              </label>
            )}
          </div>
        </div>

        <div className="drawer drawer-mobile w-full grow max-h-screen flex-1">
          <input id="side-drawer" type="checkbox" className="drawer-toggle" />

          <div className="drawer-side border-slate-100 border-r-2">
            <label
              htmlFor="side-drawer"
              className="drawer-overlay z-10"
            ></label>
            <ul className="menu p-4 overflow-y-auto w-80 text-base-content bg-white">
              {nav.map((item) => (
                <>
                  {item.name !== 'Divider' ? (
                    <li
                      className="mt-1"
                      onClick={() =>
                        (document.getElementById('side-drawer').checked = false)
                      }
                      key={item.href}
                    >
                      <Link key={item.name} href={item.href}>
                        <a
                          className={
                            router.pathname == item.href ? 'active' : ''
                          }
                        >
                          {item.icon}
                          {item.name}
                        </a>
                      </Link>
                    </li>
                  ) : (
                    <div className="border-slate-100 border-b-2 border-r-2 -mx-4 my-4"></div>
                  )}
                </>
              ))}
            </ul>
          </div>
          <div className="drawer-content flex flex-col">
            <div className="overflow-y-auto flex-1 flex">{children}</div>
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
              <p className="p-4">Connected to {account.connector.name}</p>
              <ul className="menu bg-base-100 p-2 -m-2 rounded-box">
                <li>
                  <a
                    href={`https://etherscan.io/address/${account.address}`}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    <UserIcon className="h-5 w-5" />
                    {account.ens?.name
                      ? account.ens?.name
                      : `${account.address.substring(
                          0,
                          6
                        )}...${account.address.slice(-4)}`}
                  </a>
                </li>
                <li>
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
                {connectData.connectors.map((connector) => (
                  <li key={connector.id}>
                    <a
                      disabled={!connector.ready}
                      onClick={() => connect(connector)}
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
              </p>
            </>
          )}
        </label>
      </label>
      {errorContext?.errors ? (
        <div className="fixed md:right-8 md:bottom-8 bottom-0 left-0 right-0">
          <div className="stack max-w-sm">
            {errorContext.errors.map((error) => (
              <ErrorCard error={error} key={error?.data?.message} />
            ))}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
