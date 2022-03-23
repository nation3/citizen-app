import { useAccount } from '../lib/use-wagmi'
import ActionNeedsTokenApproval from './ActionNeedsTokenApproval'

export default function ActionButton({
  className,
  children,
  action,
  preAction,
  approval,
}) {
  const [{ data: account }] = useAccount()
  const [{ loading, error }, call] = action
  const onClick = () => {
    preAction && preAction()
    call()
  }
  return (
    <>
      {!account ? (
        <label htmlFor="web3-modal" className={`${className} modal-button`}>
          {children}
        </label>
      ) : loading && !error ? (
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
