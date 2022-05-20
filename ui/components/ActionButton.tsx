import React from 'react'
import usePreferredNetwork from '../lib/use-preferred-network'
import { useAccount, useNetwork } from '../lib/use-wagmi'
import ActionNeedsTokenApproval from './ActionNeedsTokenApproval'

export default function ActionButton({
  className,
  children,
  action,
  preAction,
  postAction,
  approval,
}: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
  const { data: account } = useAccount()
  const { isLoading, write } = action
  const onClick = async () => {
    preAction && preAction()
    /* Will have to change once wagmi's useContractWrite works again,
    since they return a TransactionResponse instead of already returning
    the mined transaction */
    const tx = await write()
    postAction && tx.hash && postAction()
  }

  const { activeChain } = useNetwork({})
  const { isPreferredNetwork } = usePreferredNetwork()

  return (
    <>
      {!isPreferredNetwork ? (
        <button className={className} disabled>
          {!activeChain?.id ? 'Not Connected' : 'Wrong Network'}
        </button>
      ) : !account ? (
        <label htmlFor="web3-modal" className={`${className} modal-button`}>
          {children}
        </label>
      ) : isLoading ? (
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
