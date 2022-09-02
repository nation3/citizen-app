import React from 'react'
import usePreferredNetwork from '../lib/use-preferred-network'
import { useNetwork } from '../lib/use-wagmi'
import SwitchNetworkBanner from './SwitchNetworkBanner'

export default function PreferredNetworkWrapper({ children }: any) {
  const { chain } = useNetwork()
  const { isPreferredNetwork, preferredNetwork } = usePreferredNetwork()

  return (
    <>
      {!isPreferredNetwork && chain?.id && (
        <SwitchNetworkBanner newNetwork={preferredNetwork} />
      )}
      {children}
    </>
  )
}
