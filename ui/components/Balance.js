import { ethers } from 'ethers'

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
        `${prefix}${Number(
          balance instanceof ethers.BigNumber
            ? ethers.utils.formatEther(balance)
            : balance
        ).toFixed(decimals)}${suffix}`
      ) : (
        0
      )}
    </>
  )
}
