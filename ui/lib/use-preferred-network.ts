import { useEffect, useState } from 'react'
import { networkToId } from './network-id'
import { useNetwork } from './use-wagmi'

const preferredNetwork = process.env.NEXT_PUBLIC_CHAIN

export default function usePreferredNetwork() {
  const { activeChain } = useNetwork({})

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
