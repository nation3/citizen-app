import React from 'react'
import usePreferredNetwork from '../lib/use-preferred-network'
import SwitchNetworkBanner from './SwitchNetworkBanner'

export default function PreferredNetworkWrapper({ children }: any) {
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
