import { useMemo } from 'react'
import VotingEscrow from '../abis/VotingEscrow'
import { veNationToken } from '../lib/config'
import { Address, useBalance, useContractRead, useContractWrite } from 'wagmi'
import { BigNumber, BigNumberish } from 'ethers'

export function useVeNationBalance({ address }: { address: Address | undefined }) {
    return useBalance({
        addressOrName: address,
        token: veNationToken,
        watch: true,
        enabled: typeof address !== "undefined",
    })
}

let gasLimits = {
    locked: 330000,
    create_lock: 600000,
    increase_amount: 600000,
    increase_unlock_time: 600000,
    withdraw: 400000,
}

export function useVeNationLock({ address, enabled = true }: { address: Address | undefined, enabled?: boolean }) {
    return useContractRead({
        address: veNationToken,
        abi: VotingEscrow,
        functionName: 'locked',
        args: [address as Address],
        watch: true,
        enabled: typeof address !== "undefined" && enabled,
        overrides: {
            gasLimit: BigNumber.from(gasLimits.locked),
        },
    })
}

export function useVeNationCreateLock() {
    const { write, ...args } = useContractWrite({
        mode: "recklesslyUnprepared",
        address: veNationToken,
        abi: VotingEscrow,
        functionName: 'create_lock',
        // args: [BigNumber.from(amount), BigNumber.from(time)],
        overrides: {
            gasLimit: BigNumber.from(gasLimits.create_lock),
        },
    })

    const createLock = (amount: BigNumberish, time: BigNumberish) => {
        return write?.({
            recklesslySetUnpreparedArgs: [BigNumber.from(amount), BigNumber.from(time)]
        })
    }

    return { createLock, ...args }
}

export function useVeNationIncreaseLock({ currentAmount, currentTime }: { currentAmount: BigNumber, currentTime: BigNumber }) {
    const { write: increaseLockAmount } =
        useVeNationIncreaseLockAmount()
    const { write: increaseLockTime } =
        useVeNationIncreaseLockTime()

    const increaseLock = (amount: BigNumberish, time: BigNumberish) => {
        if (BigNumber.from(amount).gt(currentAmount)) {
            return increaseLockAmount?.({ recklesslySetUnpreparedArgs: [BigNumber.from(amount)] })
        }
        if (BigNumber.from(time).gt(currentTime)) {
            return increaseLockTime?.({ recklesslySetUnpreparedArgs: [BigNumber.from(time)] })
        }
    }

    return { increaseLock }
}

export function useVeNationIncreaseLockAmount() {
    return useContractWrite({
        mode: "recklesslyUnprepared",
        address: veNationToken,
        abi: VotingEscrow,
        functionName: 'increase_amount',
        overrides: {
            gasLimit: BigNumber.from(gasLimits.increase_amount),
        },
    })
}

export function useVeNationIncreaseLockTime() {
    return useContractWrite({
        mode: "recklesslyUnprepared",
        address: veNationToken,
        abi: VotingEscrow,
        functionName: 'increase_unlock_time',
        overrides: {
            gasLimit: BigNumber.from(gasLimits.increase_unlock_time),
        },
    })
}

export function useVeNationWithdrawLock() {
    return useContractWrite({
        mode: "recklesslyUnprepared",
        address: veNationToken,
        abi: VotingEscrow,
        functionName: 'withdraw',
        overrides: {
            gasLimit: BigNumber.from(gasLimits.withdraw),
        },
    })
}

export function useVeNationSupply() {
    return useContractRead({
        address: veNationToken,
        abi: VotingEscrow,
        functionName: 'totalSupply'
    })
}
