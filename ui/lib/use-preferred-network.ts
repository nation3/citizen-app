import { useEffect, useState } from 'react'
import networkToId from './network-id'
import { useNetwork } from './use-wagmi'

export default function usePreferredNetwork() {
  const { activeChain } = useNetwork({})
  const preferredNetwork = process.env.NEXT_PUBLIC_CHAIN

  const [isPreferredNetwork, setIsPreferredNetwork] = useState(false)

  useEffect(() => {
    if (activeChain?.id && activeChain?.id == networkToId(preferredNetwork)) {
      setIsPreferredNetwork(true)
    } else {
      setIsPreferredNetwork(false)
    }
  }, [activeChain?.id, preferredNetwork])

  return { isPreferredNetwork, preferredNetwork }
}
