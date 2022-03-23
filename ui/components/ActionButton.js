import { useAccount } from '../lib/use-wagmi'
import ActionNeedsTokenApproval from './ActionNeedsTokenApproval'

export default function ActionButton({
  onClick,
  className,
  children,
  approval,
}) {
  const [{ data: account }] = useAccount()
  return (
    <>
      {!account ? (
        <label htmlFor="web3-modal" className={`${className} modal-button`}>
          {children}
        </label>
      ) : approval ? (
        <ActionNeedsTokenApproval
          className={className}
          onClick={onClick}
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
