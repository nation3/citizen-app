export default function LoadingBalance({
  balanceLoading,
  balanceData,
  prefix = '',
  suffix = '',
  decimals = 2,
}) {
  return (
    <>
      {balanceLoading ? (
        <button className="btn btn-square btn-ghost btn-disabled loading"></button>
      ) : balanceData ? (
        `${prefix}${Number(balanceData).toFixed(decimals)}${suffix}`
      ) : (
        0
      )}
    </>
  )
}
