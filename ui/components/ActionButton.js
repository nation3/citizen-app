import { useAccount } from '../lib/use-wagmi'
import ActionNeedsTokenApproval from './ActionNeedsTokenApproval'

export default function ActionButton({
  className,
  children,
  action,
  preAction,
  postAction,
  approval,
}) {
  const [{ data: account }] = useAccount()
  const [{ loading }, call] = action
  const onClick = async () => {
    preAction && preAction()
    /* Will have to change once wagmi's useContractWrite works again,
    since they return a TransactionResponse instead of already returning
    the mined transaction */
    const tx = await call()
    postAction && tx.hash && postAction()
  }
  return (
    <>
      {!account ? (
        <label htmlFor="web3-modal" className={`${className} modal-button`}>
          {children}
        </label>
      ) : loading ? (
        <div className={className}>
          <button className="btn btn-square btn-ghost btn-disabled loading"></button>
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
