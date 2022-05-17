import networkToId from '../lib/networkToId'
import { useNetwork } from '../lib/use-wagmi'
import SwitchNetworkBanner from './SwitchNetworkBanner'

export default function PreferredNetworkWrapper({
  children,
  preferredNetwork,
}) {
  const { activeChain } = useNetwork()

  return (
    <>
      {activeChain?.id && activeChain.id != networkToId(preferredNetwork) && (
        <SwitchNetworkBanner newNetwork={preferredNetwork} />
      )}
      {children}
    </>
  )
}
