import { ethers } from 'ethers'
import { useEffect } from 'react'
import { useTokenAllowance, useTokenApproval } from '../lib/approve'
import { useAccount } from '../lib/use-wagmi'
import ActionButton from './ActionButton'

export default function ActionNeedsTokenApproval({
  className,
  children,
  amountNeeded,
  token,
  spender,
  approveText,
  action,
  preAction,
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
    ? amountNeeded.formatted
      ? ethers.utils.parseEther(amountNeeded.formatted)
      : amountNeeded instanceof ethers.BigNumber
      ? amountNeeded
      : ethers.utils.parseEther(amountNeeded)
    : 0
  const approve = useTokenApproval({
    amountNeeded: weiAmountNeeded,
    token,
    spender,
  })
  return (
    <>
      {!tokenAllowanceLoading && !approve?.loading ? (
        tokenAllowance?.gte(weiAmountNeeded) ? (
          <ActionButton
            className={className}
            action={action}
            preAction={preAction}
          >
            {children}
          </ActionButton>
        ) : (
          <ActionButton className={className} action={approve}>
            {approveText}
          </ActionButton>
        )
      ) : (
        <div className={className}>
          <button className="btn btn-square btn-outline btn-disabled bg-transparent loading"></button>
        </div>
      )}
    </>
  )
}
