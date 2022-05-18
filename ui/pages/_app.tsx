import { ethers } from 'ethers'
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { useEffect, useState } from 'react'
import { Provider, createClient } from 'wagmi'
import { connectors, provider as externalProvider } from '../lib/connectors'
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/ErrorProvider' was resolved ... Remove this comment to see the full error message
import { ErrorProvider } from '../components/ErrorProvider'
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/Layout' was resolved to '/Us... Remove this comment to see the full error message
import Layout from '../components/Layout'
import '../styles/globals.css'

function App({
  Component,
  pageProps
}: any) {
  const [client, setClient] = useState()

  useEffect(() => {
    let provider = externalProvider
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'web3' does not exist on type 'Window & t... Remove this comment to see the full error message
    const userProvider = window.ethereum || window.web3?.currentProvider
    if (userProvider && process.env.NEXT_PUBLIC_CHAIN !== 'local') {
      provider = ({ chainId }) => {
        chainId = chainId || parseInt(userProvider.networkVersion)
        console.log(
          `Provider: Connected to the user's provider on chain with ID ${chainId}`
        )
        return new ethers.providers.Web3Provider(
          userProvider,
          process.env.NEXT_PUBLIC_CHAIN
        )
      }
    }
    setClient(
      createClient({
        autoConnect: true,
        connectors,
        provider,
      })
    )
  }, [])

  return (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <>
      {client && (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Provider client={client}>
          // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <ErrorProvider>
            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <Layout>
              // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <Component {...pageProps} />
            </Layout>
          </ErrorProvider>
        </Provider>
      )}
    </>
  )
}

export default App
