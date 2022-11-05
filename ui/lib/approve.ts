import ERC20 from '../abis/ERC20'
import { Address, useContractRead, useContractWrite } from 'wagmi'
import { BigNumber, BigNumberish } from 'ethers'

export function useTokenAllowance({ token, address, spender, enabled}: { token: Address, address: Address, spender: Address, enabled: boolean }) {
    return useContractRead(
        {
            address: token,
            abi: ERC20,
            functionName: 'allowance',
            args: [address, spender],
            enabled,
            watch: true,
        }
    )
}

export function useTokenApproval({ amountNeeded, token, spender }: { token: Address, spender: Address, amountNeeded: BigNumberish }) {
    return useContractWrite(
        {
            mode: 'recklesslyUnprepared',
            address: token,
            abi: ERC20,
            functionName: 'approve',
            args: [spender, BigNumber.from(amountNeeded)]
        }
    )
}
