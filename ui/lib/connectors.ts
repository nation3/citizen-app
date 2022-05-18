import { ethers } from 'ethers'
import { chain } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../public/icons/connectors/coi... Remove this comment to see the full error message
import CoinbaseWalletIcon from '../public/icons/connectors/coinbase.svg'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../public/icons/connectors/fra... Remove this comment to see the full error message
import FrameIcon from '../public/icons/connectors/frame.svg'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../public/icons/connectors/met... Remove this comment to see the full error message
import MetaMaskIcon from '../public/icons/connectors/metamask.svg'
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../public/icons/connectors/wal... Remove this comment to see the full error message
import WalletConnectIcon from '../public/icons/connectors/walletconnect.svg'

const chains = [chain.mainnet, chain.goerli, chain.localhost]

export function provider({
  chainId
}: any) {
  if (process.env.NEXT_PUBLIC_CHAIN === 'local') {
    console.log('Provider: Connected to localhost provider')
    return new ethers.providers.JsonRpcProvider(
      'http://localhost:7545',
      chain.localhost.id
    )
  } else {
    console.log(
      `Provider: Connected to the external provider on chain ${process.env.NEXT_PUBLIC_CHAIN}`
    )
    return ethers.getDefaultProvider(process.env.NEXT_PUBLIC_CHAIN, {
      infura: process.env.NEXT_PUBLIC_INFURA_ID,
      alchemy: process.env.NEXT_PUBLIC_ALCHEMY_ID,
      etherscan: process.env.NEXT_PUBLIC_ETHERSCAN_ID,
      quorum: 1,
    })
  }
}

export function connectors({
  chainId
}: any) {
  return [
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
        chainId: chainId,
      },
    }),
  ]
}

export const connectorIcons = {
  Frame: FrameIcon,
  MetaMask: MetaMaskIcon,
  WalletConnect: WalletConnectIcon,
  'Coinbase Wallet': CoinbaseWalletIcon,
}
