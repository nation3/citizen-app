import Image from 'next/image'
import Link from 'next/link'
import Head from '../components/Head'
import BigTitle from '../components/BigTitle'
import GradientLink from '../components/GradientLink'
import ThesisIcon from '../public/icons/thesis.svg'
import RfsIcon from '../public/icons/rfs.svg'
import TeamIcon from '../public/icons/team.svg'
import { useAccount, useConnect } from 'wagmi'

export default function Home() {
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  return (
    <>
      <Head
        title=""
        description="It's time to reinvent the nation state."
        image=""
        type="website"
      />
      <div class="hero min-h-screen bg-base-100">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold">Hello there</h1>
            <div>
              <img src={accountData?.ens?.avatar} alt="ENS Avatar" />
              <div>
                {accountData?.ens?.name
                  ? `${accountData?.ens?.name} (${accountData?.address})`
                  : accountData?.address}
              </div>
              <div>Connected to {accountData?.connector.name}</div>
              <button onClick={disconnect}>Disconnect</button>
            </div>
            <div>
              {connectData.connectors.map((connector) => (
                <button
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connect(connector)}
                  className="btn btn-primary"
                >
                  {connector.name}
                  {!connector.ready && ' (unsupported)'}
                </button>
              ))}

              {connectError && (
                <div>{connectError?.message ?? 'Failed to connect'}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
