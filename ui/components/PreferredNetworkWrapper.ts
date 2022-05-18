import usePreferredNetwork from '../lib/use-preferred-network'
import SwitchNetworkBanner from './SwitchNetworkBanner'

export default function PreferredNetworkWrapper({
  children
}: any) {
  const { isPreferredNetwork, preferredNetwork } = usePreferredNetwork()

  return (
    <>
      {!isPreferredNetwork && (
        // @ts-expect-error ts-migrate(2749) FIXME: 'SwitchNetworkBanner' refers to a value, but is be... Remove this comment to see the full error message
        <SwitchNetworkBanner newNetwork={preferredNetwork} />
      )}
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'children'.
      {children}
    </>
  )
}
