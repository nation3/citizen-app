// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { useEffect, useState } from 'react'
import { veNationToken } from '../lib/config'
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../abis/VotingEscrow.json'. Co... Remove this comment to see the full error message
import VotingEscrow from '../abis/VotingEscrow.json'
import { transformNumber } from './numbers'
import { useContractRead, useContractWrite } from './use-wagmi'

const contractParams = {
  addressOrName: veNationToken,
  contractInterface: VotingEscrow.abi,
}

export function useVeNationBalance(address: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  return useContractRead(contractParams, 'balanceOf(address)', {
    args: [address],
    watch: true,
    enabled: address,
  })
  /*
  For some reason 'balanceOf' doens't work, therefore useBalance doesn't either
  return useBalance({
    addressOrName: address,
    token: veNationToken,
    watch: true,
    enabled: address,
  })*/
}

let gasLimits = {
  locked: 330000,
  create_lock: 600000,
  increase_amount: 600000,
  increase_unlock_time: 600000,
  withdraw: 400000,
}

export function useVeNationLock(address: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
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
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
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
  newTime
}: any) {
  const { isLoading: amountLoading, write: increaseLockAmount } =
    useVeNationIncreaseLockAmount(newAmount)
  const { isLoading: timeLoading, write: increaseLockTime } =
    useVeNationIncreaseLockTime(newTime)
  const write = () => {
    if (!newAmount.isZero()) {
      increaseLockAmount(newAmount)
    }
    if (newTime && newTime.gt(currentTime)) {
      increaseLockTime(newTime)
    }
  }

  return { isLoading: amountLoading || timeLoading, write }
}

export function useVeNationIncreaseLockAmount(amount: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  return useContractWrite(contractParams, 'increase_amount', {
    args: [amount],
    overrides: {
      gasLimit: gasLimits.increase_amount,
    },
  })
}

export function useVeNationIncreaseLockTime(time: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  return useContractWrite(contractParams, 'increase_unlock_time', {
    args: [time],
    overrides: {
      gasLimit: gasLimits.increase_unlock_time,
    },
  })
}

export function useVeNationWithdrawLock() {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  return useContractWrite(contractParams, 'withdraw', {
    overrides: {
      gasLimit: gasLimits.withdraw,
    },
  })
}

export function useVeNationSupply() {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
  return useContractRead(contractParams, 'totalSupply()')
}
