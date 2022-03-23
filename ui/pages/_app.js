import { ethers } from 'ethers'
import { NftProvider } from 'use-nft'
import { WagmiProvider } from 'wagmi'
import { connectors } from '../lib/connectors'
import { ErrorProvider } from '../components/ErrorProvider'
import Layout from '../components/Layout'
import '../styles/globals.css'

let provider = ethers.getDefaultProvider(null, {
  infura: process.env.NEXT_PUBLIC_INFURA_ID,
})

if (process.env.NEXT_PUBLIC_DEV === 'true') {
  console.log('Dev environment')
  provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
}

function App({ Component, pageProps }) {
  return (
    <ErrorProvider>
      <WagmiProvider autoConnect connectors={connectors} provider={provider}>
        <NftProvider fetcher={['ethers', { provider }]}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NftProvider>
      </WagmiProvider>
    </ErrorProvider>
  )
}

export default App
