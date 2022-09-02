import {
  useConnect as _useConnect,
  useAccount as _useAccount,
  useBalance as _useBalance,
  useNetwork as _useNetwork,
  useSwitchNetwork as _useSwitchNetwork,
  useContractRead as _useContractRead,
  useContractWrite as _useContractWrite,
  useSignTypedData as _useSignTypedData,
  usePrepareContractWrite as _usePrepareContractWrite,
} from 'wagmi'
import { useStaticCall as _useStaticCall } from './static-call'
import { useHandleError } from './use-handle-error'

export function useConnect() {
  return useHandleError(_useConnect())
}

// custom extension of wagmi
export function useStaticCall(params: any) {
  return useHandleError(_useStaticCall(params))
}

export function useAccount(params?: any) {
  return useHandleError(_useAccount(params))
}

export function useNetwork() {
  return useHandleError(_useNetwork())
}

export function useSwitchNetwork() {
  return useHandleError(_useSwitchNetwork)
}

export function useBalance(params: any) {
  return useHandleError(_useBalance(params))
}

export function useContractRead(config: any, throwOnRevert?: any) {
  return useHandleError(_useContractRead(config), throwOnRevert)
}

export function useContractWrite(config: any, throwOnRevert?: any) {
  const { config: contractWriteConfig } = _usePrepareContractWrite({
    ...config,
  })
  return useHandleError(_useContractWrite(contractWriteConfig), throwOnRevert)
}

export function useSignTypedData(params: any) {
  return useHandleError(_useSignTypedData(params))
}
