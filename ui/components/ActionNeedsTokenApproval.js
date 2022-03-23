import { ethers } from 'ethers'
import { useEffect } from 'react'
import { useTokenAllowance, useTokenApproval } from '../lib/approve'
import { useAccount } from '../lib/use-wagmi'

export default function ActionNeedsTokenApproval({
  amountNeeded,
  token,
  spender,
  onClick,
  className,
  approveText,
  children,
}) {
  const [{ data: account }] = useAccount()
  const [
    {
      data: tokenAllowance,
      loading: tokenAllowanceLoading,
      error: allowanceError,
    },
  ] = useTokenAllowance({ token, address: account?.address, spender })
  const weiAmountNeeded = amountNeeded
    ? ethers.utils.parseEther(amountNeeded.formatted)
    : 0
  const [
    { data: tokenApprovalData, error, loading: tokenApprovalLoading },
    approve,
  ] = useTokenApproval({
    amountNeeded: weiAmountNeeded,
    token,
    spender,
  })
  return (
    <>
      {!tokenAllowanceLoading && !tokenApprovalLoading ? (
        tokenAllowance?.gte(weiAmountNeeded) ? (
          <div className={className} onClick={onClick}>
            {children}
          </div>
        ) : (
          <div className={className} onClick={approve}>
            {approveText}
          </div>
        )
      ) : (
        <div className={className}>
          <button className="btn btn-square btn-ghost btn-disabled loading"></button>
        </div>
      )}
    </>
  )
}
