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
        <button className="btn btn-square btn-ghost btn-disabled loading"></button>
      ) : balance ? (
        `${prefix}${Number(balance).toFixed(decimals)}${suffix}`
      ) : (
        0
      )}
    </>
  )
}
