import usePreferredNetwork from '../lib/use-preferred-network'
import SwitchNetworkBanner from './SwitchNetworkBanner'

export default function PreferredNetworkWrapper({ children }) {
  const { isPreferredNetwork, preferredNetwork } = usePreferredNetwork()

  return (
    <>
      {!isPreferredNetwork && (
        <SwitchNetworkBanner newNetwork={preferredNetwork} />
      )}
      {children}
    </>
  )
}
