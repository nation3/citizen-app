import { createContext, useCallback, useContext, useState } from 'react'
import { useNetwork } from 'wagmi'
import { networkToId } from '../lib/network-id'

const ErrorContext = createContext({} as any)

function ErrorProvider({ children }: any) {
  const [errors, setErrors] = useState([] as any[])
  let [count, setCount] = useState(0)
  const { chain } = useNetwork()

  const addError = useCallback((newErrors: any) => {
    if (
      newErrors &&
      newErrors[0] &&
      chain?.id &&
      chain.id == networkToId(process.env.NEXT_PUBLIC_CHAIN)
    ) {
      for (let error of newErrors) {
        console.error(error)
        if (error instanceof Error) {
          error = JSON.parse(
            JSON.stringify(error, Object.getOwnPropertyNames(error))
          )
          // Don't add the error if it's "invalid address or ENS name",
          // no idea why those errors appear in the first place.
          if (
            error.code &&
            (error.code === 'INVALID_ARGUMENT' ||
              error.code === 'MISSING_ARGUMENT')
          ) {
            return
          }
        }
        setErrors((prev) => [...prev, {key: prev.length, ...error}]);
        setCount((prev) => prev + 1)
      }
    }
  }, [chain?.id]);

  const removeError = (key: any) => {
    if (key > -1) {
      setErrors(errors.filter((error: any) => error.key !== key))
      setCount(--count)
    }
  }

  const context = { errors, addError, removeError }
  return (
    <ErrorContext.Provider value={context}>{children}</ErrorContext.Provider>
  )
}

function useErrorContext() {
  const errors = useContext(ErrorContext)
  if (errors === undefined) {
    throw new Error('useErrorContext must be used within a ErrorProvider')
  }
  return errors
}

export { ErrorProvider, useErrorContext }
