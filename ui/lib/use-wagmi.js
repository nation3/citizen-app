import { useState, useCallback } from 'react'
import {
  useConnect as _useConnect,
  useAccount as _useAccount,
  useBalance as _useBalance,
  useContract,
  useContractRead as _useContractRead,
  useSigner,
} from 'wagmi'
import { useErrorContext } from '../components/ErrorProvider'
import { useHandleError } from './use-handle-error'

export function useConnect() {
  return useHandleError(_useConnect())
}

export function useAccount(params) {
  return useHandleError(_useAccount(params))
}

export function useBalance(params) {
  return useHandleError(_useBalance(params))
}

export function useContractRead(config, method, argsAndOverrides) {
  return useHandleError(_useContractRead(config, method, argsAndOverrides))
}

export function useContractWrite(config, method, argsAndOverrides) {
  return useHandleError(_useContractWrite(config, method, argsAndOverrides))
}

// Reason for this is that wagmi's useContractWrite doesn't seem to be passing arguments to ethers correctly
function _useContractWrite(config, method, argsAndOverrides) {
  const errorContext = useErrorContext()

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const [{ data: signerData, error: signerError, loading: signerLoading }] =
    useSigner()
  const contract = useContract({
    ...config,
    signerOrProvider: signerData,
  })

  const write = useCallback(async () => {
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
  return [{ data, error, loading }, write]
}
