import { ExclamationCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import { useSwitchNetwork } from '../lib/use-wagmi'

const chainIds = {
  mainnet: 1,
  goerli: 5,
}

type Indexable = {
  [key: string]: any
}

export default function SwitchNetworkBanner({ newNetwork }: any) {
  const { switchNetwork } = useSwitchNetwork()

  const capitalized = (network: any) =>
    network.charAt(0).toUpperCase() + network.slice(1)

  return (
    <div className="bg-white p-4 px-8 flex flex-col gap-4 md:flex-row justify-between md:items-center">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
        Nation3 uses {capitalized(newNetwork)} as its preferred network.
      </div>

      {/* There's a small chance the wallet used won't support switchNetwork, in which case the user needs to manually switch */}
      {/* Also check if we have specified a chain ID for the network */}
      {switchNetwork && (chainIds as Indexable)[newNetwork] && (
        <div
          className="btn btn-md btn-secondary normal-case font-medium"
          onClick={() => switchNetwork((chainIds as Indexable)[newNetwork])}
        >
          Switch to {capitalized(newNetwork)}
        </div>
      )}
    </div>
  )
}
