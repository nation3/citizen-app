export default function LoadingBalance({ balanceLoading, balanceData }) {
  return (
    <>
      {balanceLoading ? (
        <button class="btn btn-square btn-ghost btn-disabled loading"></button>
      ) : balanceData ? (
        balanceData.formatted
      ) : (
        0
      )}
    </>
  )
}
