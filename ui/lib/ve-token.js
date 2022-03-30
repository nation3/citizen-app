import { ethers } from 'ethers'
import { useState, useCallback } from 'react'
import { veNationToken } from '../lib/config'
import VotingEscrow from '../abis/VotingEscrow.json'
import { useBalance, useContractRead, useContractWrite } from './use-wagmi'

const contractParams = {
  addressOrName: veNationToken,
  contractInterface: VotingEscrow.abi,
}

export function useVeNationBalance(address) {
  return useContractRead(contractParams, 'balanceOf', {
    args: [address, null],
    watch: true,
    skip: !address,
  })
  /*return useBalance({
    addressOrName: address,
    token: veNationToken,
    watch: true,
    skip: !address,
  })*/
}

export function useVeNationLockAmount(address) {
  return useContractRead(contractParams, 'locked', {
    args: [address],
    watch: true,
    skip: !address,
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
  newTime = newTime && ethers.BigNumber.from(newTime)
  const [{ loading: amountLoading }, increaseLockAmount] =
    useVeNationIncreaseLockAmount(newAmount)
  const [{ loading: timeLoading }, increaseLockTime] =
    useVeNationIncreaseLockTime(newTime)
  const call = useCallback(() => {
    if (newAmount.gt(currentAmount)) {
      increaseLockAmount(newAmount)
    }
    if (newTime.gt(currentTime)) {
      increaseLockTime(newTime)
    }
  })

  return [{ loading: amountLoading || timeLoading }, call]
}

export function useVeNationIncreaseLockAmount(amount) {
  return useContractWrite(contractParams, 'increase_amount', {
    args: [amount],
    skip: !amount,
  })
}

export function useVeNationIncreaseLockTime(time) {
  return useContractWrite(contractParams, 'increase_unlock_time', {
    args: [time],
    skip: !time,
  })
}

export function useVeNationWithdrawLock() {
  return useContractWrite(contractParams, 'withdraw')
}
