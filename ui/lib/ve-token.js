import { useEffect, useState } from 'react'
import { veNationToken } from '../lib/config'
import VotingEscrow from '../abis/VotingEscrow.json'
import { transformNumber } from './numbers'
import { useContractRead, useContractWrite } from './use-wagmi'

const contractParams = {
  addressOrName: veNationToken,
  contractInterface: VotingEscrow.abi,
}

export function useVeNationBalance(address) {
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

export function useVeNationLock(address) {
  const bigZero = transformNumber(0, 'bignumber')
  const [data, setData] = useState({ amount: bigZero, end: bigZero })
  const res = useContractRead(contractParams, 'locked', {
    args: [address],
    watch: true,
    enabled: address,
    overrides: {
      gasLimit: gasLimits.locked,
    },
  })
  useEffect(() => {
    if (res.data) {
      res.data.amount = res.data[0]
      res.data.end = res.data[1]
      setData(res)
    }
  }, [address])
  return data
}

export function useVeNationCreateLock(amount, time) {
  return useContractWrite(contractParams, 'create_lock', {
    args: [amount, time],
    overrides: {
      gasLimit: gasLimits.create_lock,
    },
  })
}

export function useVeNationIncreaseLock({ newAmount, currentTime, newTime }) {
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

export function useVeNationIncreaseLockAmount(amount) {
  return useContractWrite(contractParams, 'increase_amount', {
    args: [amount],
    overrides: {
      gasLimit: gasLimits.increase_amount,
    },
  })
}

export function useVeNationIncreaseLockTime(time) {
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
  return useContractRead(contractParams, 'totalSupply()')
}
