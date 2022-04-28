import { ethers, providers } from 'ethers'
import { useEffect, useState } from 'react'
import { NftProvider } from 'use-nft'
import { Provider, chain, createClient, defaultChains, developmentChains } from 'wagmi'
import { connectors } from '../lib/connectors'
import { ErrorProvider } from '../components/ErrorProvider'
import Layout from '../components/Layout'
import '../styles/globals.css'

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID
const defaultChain = chain.mainnet
const isChainSupported = (chainId) =>
  chains?.some((x) => x.id === chainId)

const chains =
  process.env.NEXT_PUBLIC_CHAIN === 'mainnet'
    ? defaultChains
    : developmentChains

let externalProvider

if (process.env.NEXT_PUBLIC_CHAIN === 'local') {
  console.log('Dev environment')
  externalProvider = new ethers.providers.JsonRpcProvider(
    'http://localhost:7545'
  )
} else {
  externalProvider = ethers.getDefaultProvider(process.env.NEXT_PUBLIC_CHAIN, {
    infura: process.env.NEXT_PUBLIC_INFURA_ID,
    alchemy: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    etherscan: process.env.NEXT_PUBLIC_ETHERSCAN_ID,
    quorum: 1,
  })
}

const client = createClient({
  autoConnect: true,
  connectors,
  provider({ chainId }) {
    return new providers.AlchemyProvider(
      isChainSupported(chainId) ? chainId : defaultChain.id,
      alchemyId,
    )
  },
  webSocketProvider({ chainId }) {
    return new providers.AlchemyWebSocketProvider(
      isChainSupported(chainId) ? chainId : defaultChain.id,
      alchemyId,
    )
  },
})

function App({ Component, pageProps }) {
  const [provider, setProvider] = useState()

  useEffect(() => {
    const userProvider = window.ethereum || window.web3?.currentProvider
    if (userProvider) {
      const newProvider = new ethers.providers.Web3Provider(userProvider)
      setProvider(newProvider)
    } else {
      setProvider(provider)
    }
  }, [])

  return (
    <ErrorProvider>
      <Provider client={client}>
        <NftProvider fetcher={['ethers', { provider }]}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NftProvider>
      </Provider>
    </ErrorProvider>
  )
}

export default App
