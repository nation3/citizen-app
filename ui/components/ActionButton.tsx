import { BigNumber } from 'ethers'
import { ReactNode } from 'react'
import { useWaitForTransaction } from 'wagmi'
import usePreferredNetwork from '../lib/use-preferred-network'
import { useAccount, useNetwork } from '../lib/use-wagmi'
import ActionNeedsTokenApproval from './ActionNeedsTokenApproval'

export interface ActionButtonProps {
  className?: string;
  children: ReactNode;
  action: any;
  preAction?: Function;
  postAction?: Function;
  approval?: {
    token: string;
    spender: string;
    amountNeeded: BigNumber | number | string;
    approveText: string;
  }
}

export default function ActionButton({
  className,
  children,
  action,
  preAction,
  postAction,
  approval,
}: ActionButtonProps) {
  const { data: account } = useAccount()
  const { writeAsync, data, isLoadingOverride } = action
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
  })
  const onClick = async () => {
    preAction && preAction()
    const tx = await writeAsync()
    tx?.wait && (await tx.wait())
    postAction && postAction()
  }

  const { activeChain } = useNetwork({})
  const { isPreferredNetwork } = usePreferredNetwork()

  return (
    <>
      {!isPreferredNetwork ? (
        <button className={className} disabled>
          {!activeChain?.id ? 'Not connected' : 'Wrong network'}
        </button>
      ) : !account ? (
        <label htmlFor="web3-modal" className={`${className} modal-button`}>
          {children}
        </label>
      ) : isLoading || isLoadingOverride ? (
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
