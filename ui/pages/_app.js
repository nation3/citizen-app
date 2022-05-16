import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { Provider, createClient } from 'wagmi'
import { connectors, provider as externalProvider } from '../lib/connectors'
import { ErrorProvider } from '../components/ErrorProvider'
import Layout from '../components/Layout'
import '../styles/globals.css'

function App({ Component, pageProps }) {
  const [client, setClient] = useState()

  useEffect(() => {
    let provider = externalProvider
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
    <>
      {client && (
        <ErrorProvider>
          <Provider client={client}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </ErrorProvider>
      )}
    </>
  )
}

export default App
