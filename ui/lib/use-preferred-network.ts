import { useEffect, useState } from 'react'
import { networkToId } from './network-id'
import { useNetwork } from './use-wagmi'

const preferredNetwork = process.env.NEXT_PUBLIC_CHAIN

export default function usePreferredNetwork() {
  const { chain } = useNetwork()

  const [isPreferredNetwork, setIsPreferredNetwork] = useState(false)

  useEffect(() => {
    if (chain?.id && chain?.id == networkToId(preferredNetwork)) {
      setIsPreferredNetwork(true)
    } else {
      setIsPreferredNetwork(false)
    }
  }, [chain?.id])

  return { isPreferredNetwork, preferredNetwork }
}
