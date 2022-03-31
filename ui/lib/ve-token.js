import { ethers } from 'ethers'
import { useCallback } from 'react'
import { veNationToken } from '../lib/config'
import VotingEscrow from '../abis/VotingEscrow.json'
import { useBalance, useContractRead, useContractWrite } from './use-wagmi'

const contractParams = {
  addressOrName: veNationToken,
  contractInterface: VotingEscrow.abi,
}

export function useVeNationBalance(address) {
  return useContractRead(contractParams, 'balanceOf(address)', {
    args: [address],
    watch: true,
    skip: !address,
  })
  /*
    For some reason 'balanceOf' doens't work, therefore useBalance doesn't either
    return useBalance({
    addressOrName: address,
    token: veNationToken,
    watch: true,
    skip: !address,
  })*/
}

export function useVeNationLock(address) {
  return useContractRead(contractParams, 'locked', {
    args: [address],
    watch: true,
    skip: !address,
    overrides: {
      gasLimit: VotingEscrow.abi.find((obj) => obj.name === 'locked').gas * 10,
    },
  })
}

export function useVeNationLockEnd(address) {
  return useContractRead(contractParams, 'locked__end', {
    args: [address],
    watch: true,
    skip: !address,
  })
}

export function useVeNationCreateLock(amount, time) {
  return useContractWrite(contractParams, 'create_lock', {
    args: [amount, time],
    watch: true,
    skip: !amount || !time,
  })
}

export function useVeNationIncreaseLock({
  currentAmount,
  newAmount,
  currentTime,
  newTime,
}) {
  const [{ loading: amountLoading }, increaseLockAmount] =
    useVeNationIncreaseLockAmount(newAmount)
  const [{ loading: timeLoading }, increaseLockTime] =
    useVeNationIncreaseLockTime(newTime)
  const call = useCallback(() => {
    if (!newAmount.isZero()) {
      increaseLockAmount(newAmount)
    }
    if (newTime && newTime.gt(currentTime)) {
      increaseLockTime(newTime)
    }
  })

  return [{ loading: amountLoading || timeLoading }, call]
}

export function useVeNationIncreaseLockAmount(amount) {
  return useContractWrite(contractParams, 'increase_amount', {
    args: [amount],
    skip: !amount,
    overrides: {
      gasLimit:
        VotingEscrow.abi.find((obj) => obj.name === 'increase_amount').gas *
        100,
    },
  })
}

export function useVeNationIncreaseLockTime(time) {
  return useContractWrite(contractParams, 'increase_unlock_time', {
    args: [time],
    skip: !time,
    overrides: {
      gasLimit:
        VotingEscrow.abi.find((obj) => obj.name === 'increase_unlock_time')
          .gas * 100,
    },
  })
}

export function useVeNationWithdrawLock() {
  return useContractWrite(contractParams, 'withdraw')
}
