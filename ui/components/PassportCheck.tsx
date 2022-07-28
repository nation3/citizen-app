import { useHasPassport } from '@nation3/utils'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export default function PassportCheck({
  children,
  address,
  onPassportChecked,
}: React.PropsWithChildren<{
  address: string
  onPassportChecked: (hasPassport: boolean) => void
}>) {
  const { data: hasPassport, loading: hasPassportLoading } =
    useHasPassport(address)
  useEffect(() => {
    if (!hasPassportLoading) {
      onPassportChecked(hasPassport as any as boolean)
    }
  }, [hasPassport, hasPassportLoading])

  return <>{children}</>
}
