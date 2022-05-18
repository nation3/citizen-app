// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { createContext, useContext, useState, useEffect } from 'react'
import { useNetwork } from 'wagmi'
import networkToId from '../lib/networkToId'

const ErrorContext = createContext([])

function ErrorProvider({
  children
}: any) {
  const [errors, setErrors] = useState([])
  const [count, setCount] = useState([])
  const { activeChain } = useNetwork()

  const addError = (newErrors: any) => {
    if (
      newErrors &&
      newErrors[0] &&
      activeChain?.id &&
      activeChain.id == networkToId(process.env.NEXT_PUBLIC_CHAIN)
    ) {
      for (const error of newErrors) {
        console.error(error)
        if (error instanceof Error) {
          // @ts-expect-error ts-migrate(2588) FIXME: Cannot assign to 'error' because it is a constant.
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
        // @ts-expect-error ts-migrate(2588) FIXME: Cannot assign to 'count' because it is a constant.
        setCount(++count)
      }
    }
  }

  const removeError = (key: any) => {
    if (key > -1) {
      setErrors(errors.filter((error: any) => error.key !== key))
      // @ts-expect-error ts-migrate(2588) FIXME: Cannot assign to 'count' because it is a constant.
      setCount(--count)
    }
  }

  const context = { errors, addError, removeError }
  return (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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