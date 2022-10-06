import React from 'react'
import usePreferredNetwork from '../lib/use-preferred-network'
import { useNetwork } from '../lib/use-wagmi'
import SwitchNetworkBanner from './SwitchNetworkBanner'

export default function PreferredNetworkWrapper({ children }: any) {
  const { activeChain } = useNetwork({})
  const { isPreferredNetwork, preferredNetwork } = usePreferredNetwork()

  return (
    <>
      {!isPreferredNetwork && activeChain?.id && (
        <SwitchNetworkBanner newNetwork={preferredNetwork} />
      )}
      {children}
    </>
  )
}
