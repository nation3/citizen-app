import { BigNumber, constants } from 'ethers'
import { Address, useAccount } from 'wagmi'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useTokenAllowance, useTokenApproval } from '../lib/approve'

interface AllowanceWarningProps {
  token: Address
  spender: Address
}

export const AllowanceWarning = ({ token, spender }: AllowanceWarningProps) => {
  const { address, isConnected } = useAccount()
  const { data: tokenAllowance, isLoading: tokenAllowanceLoading } =
    useTokenAllowance({ token, address: address || constants.AddressZero, spender, enabled: isConnected })

  const { write: revokeAllowance } = useTokenApproval({
    amountNeeded: BigNumber.from('0'),
    token,
    spender,
  })

  return (
    <div className="alert mb-4 bg-yellow-100 text-yellow-700">
      <div>
        <ExclamationTriangleIcon className="h-12 w-12" />
        <div className="flex flex-col gap-0.5 text-xs text-justify">
          <span>
            For safety reasons, we recommend you{' '}
            <span className="font-semibold">limit your token allowance</span>{' '}
            for <span className="font-semibold">veNATION</span> to the amount
            you plan to deposit in the near future.
          </span>
          {!tokenAllowanceLoading && BigNumber.from(tokenAllowance).gt(0) && (
            <div className="flex w-full justify-end">
              <button
                className="bg-yellow-700 text-yellow-100 p-1 font-semibold rounded-md w-fit"
                onClick={() => revokeAllowance?.()}
              >
                Revoke your allowance
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
