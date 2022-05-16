import { useNetwork } from '../lib/use-wagmi'
import SwitchNetworkBanner from './SwitchNetworkBanner'

export default function PreferredNetworkWrapper({
  children,
  preferredNetwork,
}) {
  const { activeChain } = useNetwork()

  return (
    <>
      {activeChain &&
        activeChain.name.toUpperCase() != preferredNetwork.toUpperCase() && (
          <SwitchNetworkBanner newNetwork={preferredNetwork} />
        )}
      {children}
    </>
  )
}
