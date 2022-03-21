import { ethers } from 'ethers'
import { createContext } from 'react'
import { Provider } from 'wagmi'
import { connectors } from '../lib/connectors'
import { ErrorProvider } from '../components/ErrorProvider'
import Layout from '../components/Layout'
import '../styles/globals.css'

let provider = ethers.getDefaultProvider(null, {
  infura: process.env.NEXT_PUBLIC_INFURA_ID,
})

if (process.env.NEXT_PUBLIC_DEV) {
  provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
}

function App({ Component, pageProps }) {
  return (
    <ErrorProvider>
      <Provider autoConnect connectors={connectors} provider={provider}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </ErrorProvider>
  )
}

export default App
