import { transformNumber } from '../lib/numbers'

export default function Balance({
  loading = false,
  balance,
  prefix = '',
  suffix = '',
  decimals = 2,
}) {
  return (
    <>
      {loading ? (
        <button className="btn btn-square btn-ghost btn-disabled bg-transparent loading"></button>
      ) : balance ? (
        `${prefix}${transformNumber(balance, 'string', decimals)}${suffix}`
      ) : (
        0
      )}
    </>
  )
}
