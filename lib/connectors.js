import { chain, defaultChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WalletLinkConnector } from 'wagmi/connectors/walletLink'
import CoinbaseWalletIcon from '../public/icons/connectors/coinbase.svg'
import FrameIcon from '../public/icons/connectors/frame.svg'
import MetaMaskIcon from '../public/icons/connectors/metamask.svg'
import WalletConnectIcon from '../public/icons/connectors/walletconnect.svg'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

export function connectors({ chainId }) {
  const rpcUrl =
    defaultChains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0]
  return [
    new InjectedConnector({
      defaultChains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
      icon: WalletConnectIcon,
    }),
    new WalletLinkConnector({
      options: {
        appName: 'Nation3 app',
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
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
