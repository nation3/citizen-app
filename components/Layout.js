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
import Blockies from 'react-blockies'
import { useAccount, useConnect } from 'wagmi'
import { connectorIcons } from '../lib/connectors'
import Logo from '../public/logo.svg'

const navigation = [
  {
    name: 'Become a citizen',
    href: '/citizen',
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
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  return (
    <div className="mx-auto">
      <div className="flex flex-col h-screen">
        <div class="navbar bg-base-100 border-slate-100 border-b-2 py-0 pl-0">
          <div class="navbar-start border-slate-100 pl-0">
            <div class="w-80 border-slate-100 lg:border-r-2 py-4 box-content">
              <div className="pl-6 pt-2 cursor-pointer">
                <div class="flex-none hidden lg:block">
                  <Link href="/">
                    <Image src={Logo}></Image>
                  </Link>
                </div>
                <div class="flex-none lg:hidden">
                  <label for="my-drawer-2" class="btn btn-square btn-ghost">
                    <MenuIcon className="h-8 w-8" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="navbar-end pr-4">
            {accountData ? (
              <label for="web3-modal" class="mask mask-circle cursor-pointer">
                <Blockies seed={accountData?.address} size={12} />
              </label>
            ) : (
              <label
                for="web3-modal"
                class="btn btn-primary text-white modal-button"
              >
                Sign in
              </label>
            )}
          </div>
        </div>

        <div className="drawer drawer-mobile w-full grow max-h-screen flex-1">
          <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

          <div className="drawer-side border-slate-100 border-r-2 z-10">
            <label for="my-drawer-2" className="drawer-overlay"></label>
            <ul className="menu p-4 overflow-y-auto w-80 text-base-content bg-white">
              {navigation.map((item) => (
                <>
                  {item.name !== 'Divider' ? (
                    <li className="mt-1">
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
          <div class="drawer-content flex flex-col">
            <div className="overflow-y-auto flex-1 flex">{children}</div>
          </div>
        </div>
      </div>
      <input type="checkbox" id="web3-modal" class="modal-toggle" />
      <label for="web3-modal" className="modal cursor-pointer">
        <label class="modal-box relative" for="">
          <label
            for="web3-modal"
            class="btn btn-sm btn-circle btn-ghost absolute right-6 top-5"
          >
            ✕
          </label>

          {accountData ? (
            <>
              <h3 class="text-lg font-bold px-4">Account</h3>
              <p class="p-4">Connected to {accountData.connector.name}</p>
              <ul class="menu bg-base-100 p-2 -m-2 rounded-box">
                <li>
                  <a
                    href={`https://etherscan.io/address/${accountData.address}`}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    <UserIcon className="h-5 w-5" />
                    {accountData.ens?.name
                      ? accountData.ens?.name
                      : `${accountData.address.substring(
                          0,
                          6
                        )}...${accountData.address.slice(-4)}`}
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
                <div class="alert alert-error mb-4">
                  <div>
                    <XCircleIcon className="h-5 w-5" />
                    <span>{connectError?.message || 'Failed to connect'}</span>
                  </div>
                </div>
              ) : (
                ''
              )}
              <ul class="menu bg-base-100 p-2 -m-2 rounded-box">
                {connectData.connectors.map((connector) => (
                  <li>
                    <a
                      disabled={!connector.ready}
                      key={connector.id}
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
    </div>
  )
}
