export default function LoadingBalance({
  balanceLoading,
  balance,
  prefix = '',
  suffix = '',
  decimals = 2,
}) {
  return (
    <>
      {balanceLoading ? (
        <button className="btn btn-square btn-ghost btn-disabled loading"></button>
      ) : balance ? (
        `${prefix}${Number(balance).toFixed(decimals)}${suffix}`
      ) : (
        0
      )}
    </>
  )
}
