import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useTokenAllowance, useTokenApproval } from '../lib/approve'

export default function ActionNeedsTokenApproval({
  amountNeeded,
  token,
  spender,
  onClick,
  className,
  children,
}) {
  const [{ data: accountData }] = useAccount()
  const [{ data: tokenAllowance, loading: tokenAllowanceLoading }] =
    useTokenAllowance({ token, address: accountData?.address, spender })

  const [
    { data: tokenApprovalData, error, loading: tokenApprovalLoading },
    write,
  ] = useTokenApproval({
    amountNeeded,
    token,
    address: accountData?.address,
    spender,
  })

  console.log(tokenAllowance?.toNumber())
  console.log(amountNeeded)
  return (
    <>
      {tokenAllowance?.gt(amountNeeded) ? (
        <div className={className} onClick={onClick}>
          {children}
        </div>
      ) : (
        <div className={className} onClick={write}>
          {children} {error?.message}
        </div>
      )}
    </>
  )
}
