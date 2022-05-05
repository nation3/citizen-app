import { useNetwork } from '../lib/use-wagmi'
import SwitchNetworkBanner from './SwitchNetworkBanner'

export default function PreferredNetworkWrapper({
  children,
  preferredNetwork,
}) {
  const { data: networkData } = useNetwork()
  return (
    <>
      {networkData?.chain &&
        networkData.chain?.name.toUpperCase() !=
        preferredNetwork.toUpperCase() && (
          <SwitchNetworkBanner newNetwork={preferredNetwork} />
        )}
      {children}
    </>
  )
}
