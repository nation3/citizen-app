import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { NftProvider } from 'use-nft'
import { WagmiProvider } from 'wagmi'
import { connectors } from '../lib/connectors'
import { ErrorProvider } from '../components/ErrorProvider'
import Layout from '../components/Layout'
import '../styles/globals.css'

let externalProvider

if (process.env.NEXT_PUBLIC_CHAIN === 'local') {
  console.log('Dev environment')
  externalProvider = new ethers.providers.JsonRpcProvider(
    'http://localhost:8545'
  )
} else {
  externalProvider = ethers.getDefaultProvider(process.env.NEXT_PUBLIC_CHAIN, {
    infura: process.env.NEXT_PUBLIC_INFURA_ID,
    alchemy: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    etherscan: process.env.NEXT_PUBLIC_ETHERSCAN_ID,
    quorum: 1,
  })
}

function App({ Component, pageProps }) {
  const [provider, setProvider] = useState()

  useEffect(() => {
    const userProvider = window.ethereum || window.web3?.currentProvider
    if (userProvider) {
      setProvider(new ethers.providers.Web3Provider(userProvider))
    } else {
      setProvider(provider)
    }
  }, [])

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
