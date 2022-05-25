import { useState, useCallback } from 'react'
import {
  useConnect as _useConnect,
  useAccount as _useAccount,
  useBalance as _useBalance,
  useNetwork as _useNetwork,
  useContract,
  useContractRead as _useContractRead,
  useContractWrite as _useContractWrite,
  useSigner,
  useSignTypedData as _useSignTypedData,
} from 'wagmi'
import { useErrorContext } from '../components/ErrorProvider'
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

export function useNetwork(params: any) {
  return useHandleError(_useNetwork(params))
}

export function useBalance(params: any) {
  return useHandleError(_useBalance(params))
}

export function useContractRead(
  config: any,
  method: any,
  argsAndOverrides: any,
  throwOnRevert?: any
) {
  return useHandleError(
    _useContractRead(config, method, argsAndOverrides),
    throwOnRevert
  )
}

export function useContractWrite(
  config: any,
  method: any,
  argsAndOverrides: any,
  throwOnRevert?: any
) {
  return useHandleError(
    _useContractWrite(config, method, argsAndOverrides),
    throwOnRevert
  )
}

export function useCustomContractWrite(
  config: any,
  method: any,
  argsAndOverrides: any
) {
  return useHandleError(
    _useCustomContractWrite(config, method, argsAndOverrides)
  )
}

// Reason for this is that wagmi's useContractWrite doesn't seem to be passing arguments to ethers correctly
function _useCustomContractWrite(
  config: any,
  method: any,
  argsAndOverrides: any
) {
  const errorContext = useErrorContext()

  const [data, setData] = useState(null as any)
  const [error, setError] = useState(null as any)
  const [isLoading, setLoading] = useState(false as boolean)

  const { data: signerData, error: signerError } = useSigner()
  const contract = useContract({
    ...config,
    signerOrProvider: signerData,
  })

  const writeAsync = useCallback(async () => {
    try {
      setLoading(true)
      let data
      if (argsAndOverrides) {
        const params = [
          ...(Array.isArray(argsAndOverrides.args)
            ? argsAndOverrides.args
            : argsAndOverrides.args
            ? [argsAndOverrides.args]
            : []),
          ...(argsAndOverrides.overrides ? [argsAndOverrides.overrides] : []),
        ]
        data = await contract[method](...params)
      } else {
        data = await contract[method]()
      }
      setData(data)
      await data.wait()
      setLoading(false)
      return data
    } catch (error) {
      setError(error)
      setLoading(false)
      console.error(
        `Error in ${config.addressOrName}.${method}(${argsAndOverrides?.args})`
      )
      console.error(error)
      errorContext.addError([error])
      return error
    }
  }, [config, argsAndOverrides])
  errorContext.addError([signerError])
  return { data, error, isLoading, writeAsync }
}

export function useSignTypedData(params: any) {
  return useHandleError(_useSignTypedData(params))
}
