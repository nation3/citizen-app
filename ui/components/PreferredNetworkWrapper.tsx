import { useNetwork, usePreferredNetwork } from '@nation3/utils'
import React from 'react'
import SwitchNetworkBanner from './SwitchNetworkBanner'

export default function PreferredNetworkWrapper({ children }: any) {
  const { data: chainData } = useNetwork()
  const { isPreferredNetwork, preferredNetwork } = usePreferredNetwork()

  return (
    <>
      {!isPreferredNetwork && chainData.chain?.id && (
        <SwitchNetworkBanner newNetwork={preferredNetwork} />
      )}
      {children}
    </>
  )
}
