import { useTokenAllowance, useTokenApproval } from '../lib/approve'
import { transformNumber } from '../lib/numbers'
import { useAccount } from '../lib/use-wagmi'
import ActionButton from './ActionButton'
// @ts-expect-error ts-migrate(6142) FIXME: Module './ErrorProvider' was resolved to '/Users/g... Remove this comment to see the full error message
import { useErrorContext } from './ErrorProvider'

export default function ActionNeedsTokenApproval({
  className,
  children,
  amountNeeded,
  token,
  spender,
  approveText,
  action,
  preAction
}: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
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
    'bignumber',
    18
  )

  const approve = useTokenApproval({
    amountNeeded: weiAmountNeeded,
    token,
    spender,
  })
  return (
    <>
      {!tokenAllowanceLoading && !approve?.loading ? (
        tokenAllowance?.gte(weiAmountNeeded) ? (
          // @ts-expect-error ts-migrate(2749) FIXME: 'ActionButton' refers to a value, but is being use... Remove this comment to see the full error message
          <ActionButton
            className={className}
            action={action}
            // @ts-expect-error ts-migrate(2365) FIXME: Operator '>' cannot be applied to types '{ preActi... Remove this comment to see the full error message
            preAction={preAction}
          >
            {children}
          </ActionButton>
        ) : (
          // @ts-expect-error ts-migrate(2749) FIXME: 'ActionButton' refers to a value, but is being use... Remove this comment to see the full error message
          <ActionButton className={className} action={approve}>
            {approveText}
          </ActionButton>
        )
      ) : (
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
        <div className={className}>
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'button'.
          <button className="btn btn-square btn-link btn-disabled bg-transparent loading"></button>
        </div>
      )}
    </>
  )
}
