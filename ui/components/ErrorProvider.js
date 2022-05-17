import { createContext, useContext, useState, useEffect } from 'react'
import { useNetwork } from 'wagmi'

const ErrorContext = createContext([])

function ErrorProvider({ children }) {
  const [errors, setErrors] = useState([])
  const [count, setCount] = useState([])
  const { activeChain } = useNetwork()

  const addError = (newErrors) => {
    if (
      newErrors &&
      newErrors[0] &&
      activeChain.id &&
      activeChain.id == networkToId(process.env.NEXT_PUBLIC_CHAIN)
    ) {
      for (const error of newErrors) {
        console.error(error)
        if (error instanceof Error) {
          error = JSON.parse(
            JSON.stringify(error, Object.getOwnPropertyNames(error))
          )
          // Don't add the error if it's "invalid address or ENS name",
          // no idea why those errors appear in the first place.
          if (error.code && error.code === 'INVALID_ARGUMENT') {
            return
          }
        }
        setErrors([{ key: count, ...error }, ...errors])
        setCount(++count)
      }
    }
  }

  const removeError = (key) => {
    if (key > -1) {
      setErrors(errors.filter((error) => error.key !== key))
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
    throw new Error('useCount must be used within a CountProvider')
  }
  return errors
}

export { ErrorProvider, useErrorContext }
