import { InformationCircleIcon } from '@heroicons/react/outline'
import {
  useTokenAllowance,
  useTokenApproval,
  transformNumber,
  NumberType,
  useAccount,
} from '@nation3/utils'
import { BigNumber } from 'ethers'
import React, { useEffect, useState } from 'react'
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
}: any) {
  const { data: account } = useAccount()
  const { data: tokenAllowance, loading: tokenAllowanceLoading } =
    useTokenAllowance({ token, address: account?.address, spender })
  const [approveUnlimited, setApproveUnlimited] = useState(true)
  const [weiAmountNeeded, setWeiAmountNeeded] = useState<BigNumber>(
    BigNumber.from(0)
  )

  useEffect(() => {
    if (approveUnlimited && amountNeeded > 0) {
      setWeiAmountNeeded(BigNumber.from('1000000000000000000000000000'))
    } else {
      setWeiAmountNeeded(
        transformNumber(
          amountNeeded?.formatted || amountNeeded,
          NumberType.bignumber
        ) as BigNumber
      )
    }
  }, [amountNeeded, approveUnlimited])

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
          <div className="flex flex-col w-full">
            <label className="label cursor-pointer w-full flex justify-end">
              <div
                className="tooltip tooltip-top md:tooltip-left flex items-center gap-2"
                data-tip="Check this to avoid having to approve your veNATION on future locks."
              >
                <span className="label-text flex items-center gap-1">
                  <InformationCircleIcon className="w-4 h-4" />
                  Approve unlimited
                </span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={approveUnlimited}
                  onChange={(e) => setApproveUnlimited(e.target.checked)}
                />
              </div>
            </label>
            <ActionButton className={className} action={approve}>
              {approveText}
            </ActionButton>
          </div>
        )
      ) : (
        <div className={className}>
          <button className="btn btn-square btn-link btn-disabled bg-transparent loading"></button>
        </div>
      )}
    </>
  )
}
