import usePreferredNetwork from '../lib/use-preferred-network'
import { useAccount } from '../lib/use-wagmi'
import ActionNeedsTokenApproval from './ActionNeedsTokenApproval'

export default function ActionButton({
  className,
  children,
  action,
  preAction,
  postAction,
  approval
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
  const { isPreferredNetwork } = usePreferredNetwork()

  return (
    <>
      {!isPreferredNetwork ? (
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'button'.
        <button className={className} disabled>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'Wrong'.
          Wrong Network
        </button>
      ) : !account ? (
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'label'.
        <label htmlFor="web3-modal" className={`${className} modal-button`}>
          // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
          {children}
        </label>
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'isLoading'.
      ) : isLoading ? (
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
        <div className={className}>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'button'.
          <button className="btn btn-square btn-link btn-disabled bg-transparent loading"></button>
        </div>
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'approval'.
      ) : approval ? (
        // @ts-expect-error ts-migrate(2749) FIXME: 'ActionNeedsTokenApproval' refers to a value, but ... Remove this comment to see the full error message
        <ActionNeedsTokenApproval
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
          className={className}
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'action'.
          action={action}
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'preAction'.
          preAction={preAction}
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'approval'.
          {...approval}
        // @ts-expect-error ts-migrate(2365) FIXME: Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
        >
          // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
          {children}
        </ActionNeedsTokenApproval>
      ) : (
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
        <div className={className} onClick={onClick}>
          // @ts-expect-error ts-migrate(18004) FIXME: No value exists in scope for the shorthand propert... Remove this comment to see the full error message
          {children}
        </div>
      )}
    </>
  )
}
