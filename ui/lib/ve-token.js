import { veNationToken } from '../lib/config'
import { abi as veNationTokenABI } from '../abis/veToken.json'
import { useBalance, useContractRead, useContractWrite } from './use-wagmi'

export function useVeNationBalance(address) {
  return useBalance({
    addressOrName: address,
    token: veNationToken,
    watch: true,
    skip: !address,
  })
}

const contractParams = {
  addressOrName: veNationToken,
  abi: veNationTokenABI,
  watch: true,
}

export function useVeNationLockAmount(address) {
  return useContractRead(
    {
      ...contractParams,
      skip: !address,
    },
    'locked',
    { args: [address] }
  )
}

export function useVeNationLockEnd(address) {
  return useContractRead(
    {
      ...contractParams,
      skip: !address,
    },
    'locked__end',
    { args: [address] }
  )
}

export function useVeNationCreateLock(amount, time) {
  return useContractWrite(
    {
      ...contractParams,
      skip: !amount || !time,
    },
    'create_lock',
    { args: [amount, time] }
  )
}

export function useVeNationIncreaseLockAmount(amount) {
  return useContractWrite(
    {
      ...contractParams,
      skip: !amount,
    },
    'increase_unlock_amount',
    { args: [amount] }
  )
}

export function useVeNationIncreaseLockTime(time) {
  return useContractWrite(
    {
      ...contractParams,
      skip: !time,
    },
    'increase_unlock_time',
    { args: [time] }
  )
}

export function useVeNationWithdrawLock() {
  return useContractWrite(
    {
      ...contractParams,
    },
    'withdraw'
  )
}
