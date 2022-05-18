// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { useState, useCallback } from 'react'
import {
  useConnect as _useConnect,
  useAccount as _useAccount,
  useBalance as _useBalance,
  useNetwork as _useNetwork,
  useContract,
  useContractRead as _useContractRead,
  useContractWrite as _wagmiUseContractWrite,
  useSigner,
} from 'wagmi'
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/ErrorProvider' was resolved ... Remove this comment to see the full error message
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

export function useAccount(params: any) {
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
  throwOnRevert: any
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
  throwOnRevert: any
) {
  return useHandleError(
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 4.
    _useContractWrite(config, method, argsAndOverrides, throwOnRevert)
  )
}

export function useWagmiContractWrite(config: any, method: any, argsAndOverrides: any) {
  return useHandleError(
    _wagmiUseContractWrite(config, method, argsAndOverrides)
  )
}

// Reason for this is that wagmi's useContractWrite doesn't seem to be passing arguments to ethers correctly
function _useContractWrite(config: any, method: any, argsAndOverrides: any) {
  const errorContext = useErrorContext()

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const { data: signerData, error: signerError } = useSigner()
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
  return { data, error, isLoading, write }
}
