import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { useNetwork } from '../lib/use-wagmi'

const chainIds = {
  mainnet: 1,
  goerli: 5,
}

export default function SwitchNetworkBanner({
  newNetwork
}: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
  const { switchNetwork } = useNetwork()

  const capitalized = (network: any) => network.charAt(0).toUpperCase() + network.slice(1)

  return (
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
    <div className="bg-white p-4 px-8 flex flex-col gap-4 md:flex-row justify-between md:items-center">
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        // @ts-expect-error ts-migrate(2749) FIXME: 'ExclamationCircleIcon' refers to a value, but is ... Remove this comment to see the full error message
        <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Nation3'.
        Nation3 uses {capitalized(newNetwork)} as its preferred network.
      </div>

      {/* There's a small chance the wallet used won't support switchNetwork, in which case the user needs to manually switch */}
      {/* Also check if we have specified a chain ID for the network */}
      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      {switchNetwork && chainIds[newNetwork] && (
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
        <div
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
          className="btn btn-md btn-secondary normal-case font-medium"
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'onClick'.
          onClick={() => switchNetwork(chainIds[newNetwork])}
        >
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Switch'.
          Switch to {capitalized(newNetwork)}
        </div>
      )}
    </div>
  )
}
