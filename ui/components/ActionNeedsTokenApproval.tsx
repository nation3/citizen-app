import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { constants, BigNumber } from 'ethers'
import { ReactNode, useState } from 'react'
import { useTokenAllowance, useTokenApproval } from '../lib/approve'
import { Address, useAccount } from 'wagmi'
import ActionButton, { ActionButtonProps } from './ActionButton'

interface ActionNeedsApprovalProps extends ActionButtonProps {
    children: ReactNode,
    amountNeeded: BigNumber,
    token: Address,
    spender: Address,
    approveText: string,
    allowUnlimited?: boolean,
    className?: string,
}

export default function ActionNeedsTokenApproval({
    children,
    amountNeeded,
    token,
    spender,
    approveText,
    action,
    preAction,
    allowUnlimited = true,
    className
}: ActionNeedsApprovalProps) {
    const { address, isConnected } = useAccount()
    const { data: tokenAllowance, isLoading: tokenAllowanceLoading } =
        useTokenAllowance({ token, address: address || constants.AddressZero, spender, enabled: isConnected })
    const [approveUnlimited, setApproveUnlimited] = useState(allowUnlimited)

    const approve = useTokenApproval({
        amountNeeded: approveUnlimited
            ? BigNumber.from('1000000000000000000000000000')
            : amountNeeded,
        token,
        spender,
    })

    return (
        <>
            {!tokenAllowanceLoading && !approve?.isLoading ? (
                BigNumber.from(tokenAllowance)?.gte(amountNeeded) ? (
                    <ActionButton
                        className={className}
                        action={action}
                        preAction={preAction}
                    >
                        {children}
                    </ActionButton>
                ) : (
                    <div className="flex flex-col w-full">
                        {allowUnlimited && (
                            <label className="label cursor-pointer w-full flex justify-end">
                                <div
                                    className="tooltip tooltip-top md:tooltip-left flex items-center gap-2"
                                    data-tip="Check this to avoid having to approve your veNATION on future locks."
                                >
                                    <span className="label-text flex items-center gap-1">
                                        <InformationCircleIcon className="w-4 h-4" />
                                        Approve unlimited
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary"
                                        checked={approveUnlimited}
                                        onChange={(e) => setApproveUnlimited(e.target.checked)}
                                    />
                                </div>
                            </label>
                        )}
                        <ActionButton className={className} action={approve}>
                            {approveText}
                        </ActionButton>
                    </div>
                )
            ) : (
                <div className={className}>
                    <button className="btn btn-square btn-link btn-disabled bg-transparent loading"></button>
                </div>
            )}
        </>
    )
}
