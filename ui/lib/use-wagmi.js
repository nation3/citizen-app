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

  const [
    { data: signerData, error: signerError, loading: signerLoading },
    getSigner,
  ] = useSigner()
  const contract = useContract({
    ...config,
    signerOrProvider: signerData,
  })

  const write = useCallback(async () => {
    const signer = await getSigner()
    contract.connect(signer)
    console.log(contract)
    try {
      setLoading(true)
      let data
      if (argsAndOverrides) {
        console.log('calling')
        contract.connect(signer)
        data = await contract[method](...argsAndOverrides.args)
      } else {
        data = await contract[method]()
      }
      setData(data)
      setLoading(false)
    } catch (error) {
      setError(error)
      console.error(
        `Error in ${config.addressOrName}.${method}(${argsAndOverrides?.args})`
      )
      console.error(error)
      errorContext.addError([error])
    }
  }, [config, signerData, argsAndOverrides])
  errorContext.addError([signerError])
  return [{ data, error, loading }, write]
}

function _useContractWrite2(contractConfig, functionName, argsAndOverrides) {
  /*const {
    state: { connector },
  } = useContext()*/
  const [
    { data: signerData, error: signerError, loading: signerLoading },
    getSigner,
  ] = useSigner({ skip: true })

  const contract = useContract(contractConfig)
  const [state, setState] = useState({ loading: false })

  //const cancelQuery = useCancel()
  const write = useCallback(
    async (config) => {
      /*let didCancel = false
      cancelQuery(() => {
        didCancel = true
      })*/

      try {
        // const config_ = config ?? { args, overrides }
        //if (!connector) throw new ConnectorNotFoundError()
        /*const params = [
          ...(Array.isArray(config_.args)
            ? config_.args
            : config_.args
            ? [config_.args]
            : []),
          ...(config_.overrides ? [config_.overrides] : []),
        ]*/
        const params = argsAndOverrides.args

        setState((x) => ({
          ...x,
          error: undefined,
          loading: true,
          response: undefined,
        }))
        const signer = await getSigner()
        const contract_ = contract.connect(signer)
        const response = await contract_[functionName](...params)
        /*if (!didCancel) {
          setState((x) => ({ ...x, loading: false, response }))
        }*/
        return { data: response, error: undefined }
      } catch (error_) {
        let error = error_
        if (error_.code === 4001) console.log('UserRejectedRequestError')
        /*if (!didCancel) {
          setState((x) => ({ ...x, error, loading: false }))
        }*/
        console.log(error)
        return { data: undefined, error }
      }
    },
    [argsAndOverrides, signerData, contract, functionName]
  )

  return [
    {
      data: state.response,
      error: state.error,
      loading: state.loading,
    },
    write,
  ]
}
