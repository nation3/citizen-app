import { veNationToken } from '../lib/config'
import VotingEscrow from '../abis/VotingEscrow.json'
import { useContractRead, useContractWrite } from './use-wagmi'

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

let gasLimits = {
  locked: 330000,
  create_lock: 438772,
  increase_amount: 370183,
  increase_unlock_time: 337407,
  withdraw: 330560,
}

export function useVeNationLock(address) {
  return useContractRead(contractParams, 'locked', {
    args: [address],
    watch: true,
    skip: !address,
    overrides: {
      gasLimit: gasLimits.locked,
    },
  })
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
  const [{ loading: amountLoading }, increaseLockAmount] =
    useVeNationIncreaseLockAmount(newAmount)
  const [{ loading: timeLoading }, increaseLockTime] =
    useVeNationIncreaseLockTime(newTime)
  const call = () => {
    if (!newAmount.isZero()) {
      increaseLockAmount(newAmount)
    }
    if (newTime && newTime.gt(currentTime)) {
      increaseLockTime(newTime)
    }
  }

  return [{ loading: amountLoading || timeLoading }, call]
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
