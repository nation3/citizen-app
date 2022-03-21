// Reason for this is that wagmi's useContractWrite doesn't seem to be passing arguments to ethers correctly
import { useState, useEffect } from 'react'
import {
  useContract,
  useContractRead as useContractReadOriginal,
  useSigner,
  useProvider,
} from 'wagmi'
import { useErrorContext, handleErrors } from '../components/ErrorProvider'

export function useContractRead(config, method, argsAndOverrides) {
  const errorContext = useErrorContext()
  const [{ data, error, loading }] = useContractReadOriginal(
    config,
    method,
    argsAndOverrides
  )
  useEffect(() => {
    errorContext.addError([error])
  }, [error])
  return [{ data, error, loading }]
}

export function useContractWrite(config, method, argsAndOverrides) {
  const errorContext = useErrorContext()

  const [
    { data: signerData, error: signerError, loadin: signerLoading },
    getSigner,
  ] = useSigner()
  const contract = useContract({
    ...config,
    signerOrProvider: signerData,
  })

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const write = async () => {
    const signer = await getSigner()
    contract.connect(signer)
    try {
      setLoading(true)
      let data
      if (argsAndOverrides) {
        data = await contract[method](...argsAndOverrides.args)
      } else {
        data = await contract[method]()
      }
      setData(data)
      setLoading(false)
    } catch (error) {
      setError(error)
      errorContext.addError([error])
    }
  }
  errorContext.addError([signerError])
  return [{ data, error, loading }, write]
}
