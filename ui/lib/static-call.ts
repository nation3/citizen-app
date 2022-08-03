import { useEffect, useState } from 'react'
import { useContract, useSigner } from 'wagmi'

// Hook for calling a contract write method without executing, getting the result without changing state (and thus gas fees)
export function useStaticCall({
  addressOrName,
  contractInterface,
  methodName,
  args,
  defaultData,
  skip = false,

  // set to false if you'd like a reverted txn to be ignored and use the default data
  throwOnRevert = true,

  genericErrorMessage = 'Error calling contract',
}: any) {
  args = args?.length === 0 ? undefined : args // args should be undefined if there are no arguments, make sure here

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(defaultData)

  const { data: signer } = useSigner()

  const contract = useContract({
    addressOrName: addressOrName,
    contractInterface: contractInterface,
    signerOrProvider: signer,
  })

  useEffect(() => {
    const call = async () => {
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
          setError({ ...(error as any), message: genericErrorMessage })
        }
      } finally {
        setLoading(false)
      }
    }

    call()
  }, [
    skip,
    addressOrName,
    contractInterface,
    methodName,
    genericErrorMessage,
    signer,
    args,
    contract.callStatic,
    throwOnRevert
  ])

  return {
    data,
    error,
    loading,
    method: contract.callStatic[methodName],
  }
}
