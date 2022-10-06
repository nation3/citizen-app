import { useMemo } from 'react'
import VotingEscrow from '../abis/VotingEscrow.json'
import { veNationToken } from '../lib/config'
import { useBalance, useContractRead, useContractWrite } from './use-wagmi'

const contractParams = {
  addressOrName: veNationToken,
  contractInterface: VotingEscrow.abi,
}

export function useVeNationBalance(address: any) {
  return useBalance({
    addressOrName: address,
    token: veNationToken,
    watch: true,
    enabled: address,
  })
}

let gasLimits = {
  locked: 330000,
  create_lock: 600000,
  increase_amount: 600000,
  increase_unlock_time: 600000,
  withdraw: 400000,
}

export function useVeNationLock(address: any) {
  return useContractRead(contractParams, 'locked', {
    args: [address],
    watch: true,
    enabled: !!address,
    overrides: {
      gasLimit: gasLimits.locked,
    },
  })
}

export function useVeNationCreateLock(amount: any, time: any) {
  return useContractWrite(contractParams, 'create_lock', {
    args: [amount, time],
    overrides: {
      gasLimit: gasLimits.create_lock,
    },
  })
}

export function useVeNationIncreaseLock({
  newAmount,
  currentTime,
  newTime,
}: any) {
  const { writeAsync: increaseLockAmount, data: lockAmountData } =
    useVeNationIncreaseLockAmount(newAmount)
  const { writeAsync: increaseLockTime, data: lockTimeData } =
    useVeNationIncreaseLockTime(newTime)
  return useMemo(() => {
    if (newAmount && newAmount.gt(0)) {
      return { writeAsync: increaseLockAmount, data: lockAmountData }
    }
    if (newTime && currentTime && newTime.gt(currentTime)) {
      return { writeAsync: increaseLockTime, data: lockTimeData }
    }
    return {}
  }, [newAmount, currentTime, newTime, increaseLockAmount, increaseLockTime, lockAmountData, lockTimeData])
}

export function useVeNationIncreaseLockAmount(amount: any) {
  return useContractWrite(contractParams, 'increase_amount', {
    args: [amount],
    overrides: {
      gasLimit: gasLimits.increase_amount,
    },
  })
}

export function useVeNationIncreaseLockTime(time: any) {
  return useContractWrite(contractParams, 'increase_unlock_time', {
    args: [time],
    overrides: {
      gasLimit: gasLimits.increase_unlock_time,
    },
  })
}

export function useVeNationWithdrawLock() {
  return useContractWrite(contractParams, 'withdraw', {
    overrides: {
      gasLimit: gasLimits.withdraw,
    },
  })
}

export function useVeNationSupply() {
  return useContractRead(contractParams, 'totalSupply()', {})
}
