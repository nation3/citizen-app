import React from 'react'
import { useTokenAllowance, useTokenApproval } from '../lib/approve'
import { NumberType, transformNumber } from '../lib/numbers'
import { useAccount } from '../lib/use-wagmi'
import ActionButton from './ActionButton'
import { useErrorContext } from './ErrorProvider'

export default function ActionNeedsTokenApproval({
  className,
  children,
  amountNeeded,
  token,
  spender,
  approveText,
  action,
  preAction,
}: any) {
  const { data: account } = useAccount()
  const {
    data: tokenAllowance,
    isLoading: tokenAllowanceLoading,
    error: allowanceError,
  } = useTokenAllowance({ token, address: account?.address, spender })

  const { addError } = useErrorContext()
  addError([allowanceError])

  const weiAmountNeeded = transformNumber(
    amountNeeded?.formatted || amountNeeded,
    NumberType.bignumber
  )

  const approve = useTokenApproval({
    amountNeeded: weiAmountNeeded,
    token,
    spender,
  })

  return (
    <>
      {!tokenAllowanceLoading && !approve?.isLoading ? (
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
          <button className="btn btn-square btn-link btn-disabled bg-transparent loading"></button>
        </div>
      )}
    </>
  )
}
