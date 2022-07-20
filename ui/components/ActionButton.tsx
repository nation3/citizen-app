import {
  useAccount,
  useNetwork,
  usePreferredNetwork,
  useWaitForTransaction,
} from '@nation3/utils'
import React from 'react'
import ActionNeedsTokenApproval from './ActionNeedsTokenApproval'

export default function ActionButton({
  className,
  children,
  action,
  preAction,
  postAction,
  approval,
}: any) {
  const { data: account } = useAccount()
  const { writeAsync, data, isLoadingOverride } = action

  const { loading } = useWaitForTransaction({
    hash: data?.hash,
  })
  const onClick = async () => {
    preAction && preAction()
    const tx = await writeAsync()
    tx?.wait && (await tx.wait())
    postAction && postAction()
  }

  const { data: chainData } = useNetwork()
  const { isPreferredNetwork } = usePreferredNetwork()

  return (
    <>
      {!isPreferredNetwork ? (
        <button className={className} disabled>
          {!chainData.chain?.id ? 'Not connected' : 'Wrong network'}
        </button>
      ) : !account ? (
        <label htmlFor="web3-modal" className={`${className} modal-button`}>
          {children}
        </label>
      ) : loading || isLoadingOverride ? (
        <div className={className}>
          <button className="btn btn-square btn-link btn-disabled bg-transparent loading"></button>
        </div>
      ) : approval ? (
        <ActionNeedsTokenApproval
          className={className}
          action={action}
          preAction={preAction}
          {...approval}
        >
          {children}
        </ActionNeedsTokenApproval>
      ) : (
        <div className={className} onClick={onClick}>
          {children}
        </div>
      )}
    </>
  )
}
