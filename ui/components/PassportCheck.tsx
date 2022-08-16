import React, { useEffect } from 'react'
import { useHasPassport } from '../lib/passport-nft'

export default function PassportCheck({
  children,
  address,
  onPassportChecked,
}: React.PropsWithChildren<{
  address: string
  onPassportChecked: (hasPassport: boolean) => void
}>) {
  const { hasPassport, isLoading: hasPassportLoading } = useHasPassport(address)
  useEffect(() => {
    if (!hasPassportLoading) {
      onPassportChecked(hasPassport)
    }
  }, [hasPassport, hasPassportLoading, onPassportChecked])

  return <>{children}</>
}
