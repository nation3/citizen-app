import { useEffect } from 'react'
import { useState } from 'react'
import networkToId from './networkToId'
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
  }, [activeChain?.id])

  return { isPreferredNetwork, preferredNetwork }
}
