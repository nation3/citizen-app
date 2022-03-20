export default function LoadingBalance({
  balanceLoading,
  balanceData,
  prefix = '',
  suffix = '',
}) {
  return (
    <>
      {balanceLoading ? (
        <button className="btn btn-square btn-ghost btn-disabled loading"></button>
      ) : balanceData ? (
        `${prefix}${balanceData.formatted}${suffix}`
      ) : (
        0
      )}
    </>
  )
}
