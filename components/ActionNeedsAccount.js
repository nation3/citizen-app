import { useAccount } from 'wagmi'

export default function ActionNeedsAccount({ onClick, className, children }) {
  const [{ data: accountData }] = useAccount()
  return (
    <>
      {accountData ? (
        <div className={className} onClick={onClick}>
          {children}
        </div>
      ) : (
        <label htmlFor="web3-modal" className={`${className} modal-button`}>
          {children}
        </label>
      )}
    </>
  )
}
