import { useState, useEffect } from 'react'
import { useSigner, useContract } from 'wagmi'

// Hook for calling a contract write method without executing, getting the result without changing state (and thus gas fees)
export function useStaticCall({
  addressOrName,
  contractInterface,
  methodName,
  args,
  defaultData,
  skip = false,
  throwOnRevert = true, // set to false if you'd like a reverted txn to be ignored and use the default data
  genericErrorMessage = 'Error calling contract',
}) {
  args = args?.length === 0 ? undefined : args // args should be undefined if there are no arguments, make sure here

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(defaultData)

  const [{ data: signer, isError: signerError, isLoading: signerLoading }] =
    useSigner()

  const contract = useContract({
    addressOrName: addressOrName,
    contractInterface: contractInterface,
    signerOrProvider: signer,
  })

  useEffect(async () => {
    if (skip || !signer) {
      return
    }
    try {
      const result = args
        ? await contract.callStatic[methodName](...args)
        : await contract.callStatic[methodName]()
      setData(result)
    } catch (error) {
      if (throwOnRevert) {
        console.error(error)
        setError({ ...error, message: genericErrorMessage })
      }
    } finally {
      setLoading(false)
    }
  }, [
    skip,
    addressOrName,
    contractInterface,
    methodName,
    genericErrorMessage,
    JSON.stringify(args),
    signer,
  ])

  return [
    { data, error, loading },
    contract.callStatic[methodName],
    signer,
    signerLoading,
    signerError,
  ]
}
