import { transformNumber } from '../lib/numbers'

export default function Balance({
  loading = false,
  balance,
  prefix = '',
  suffix = '',
  decimals = 2
}: any) {
  return <>
    // @ts-expect-error ts-migrate(2349) FIXME: This expression is not callable.
    {loading ? (
      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'button' implicitly has an 'any' type.
      <button className="btn btn-square btn-ghost btn-disabled bg-transparent loading"></button>
    // @ts-expect-error ts-migrate(2749) FIXME: 'balance' refers to a value, but is being used as ... Remove this comment to see the full error message
    ) : balance ? (
      `${prefix}${transformNumber(balance, 'string', decimals)}${suffix}`
    ) : (
      0
    )}
  </>;
}
