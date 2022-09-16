import { ethers } from 'ethers'
import { chain } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import CoinbaseWalletIcon from '../public/icons/connectors/coinbase.svg'
import FrameIcon from '../public/icons/connectors/frame.svg'
import MetaMaskIcon from '../public/icons/connectors/metamask.svg'
import WalletConnectIcon from '../public/icons/connectors/walletconnect.svg'
import { networkToId } from './network-id'

const chains = [chain.mainnet, chain.goerli, chain.hardhat]

export function provider() {
  if (process.env.NEXT_PUBLIC_CHAIN === 'local') {
    console.log('Provider: Connected to localhost provider')
    return new ethers.providers.JsonRpcProvider(
      'http://127.0.0.1:7545',
      networkToId(process.env.NEXT_PUBLIC_CHAIN)
    )
  } else {
    console.log(
      `Provider: Connected to the external provider on chain ${process.env.NEXT_PUBLIC_CHAIN}`
    )
    return ethers.getDefaultProvider(process.env.NEXT_PUBLIC_CHAIN, {
      infura: process.env.INFURA_ID,
      alchemy: process.env.ALCHEMY_ID,
      etherscan: process.env.ETHERSCAN_ID,
      quorum: 1,
    });
  }
}

export const connectors = [
  new InjectedConnector({
    chains,
    options: { shimDisconnect: true },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      qrcode: true,
    },
  }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'Nation3 app',
    },
  }),
]

export const connectorIcons = {
  Frame: FrameIcon,
  MetaMask: MetaMaskIcon,
  WalletConnect: WalletConnectIcon,
  'Coinbase Wallet': CoinbaseWalletIcon,
}
