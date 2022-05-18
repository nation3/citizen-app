import { useEffect } from 'react'
import { useErrorContext } from '../components/ErrorProvider'

// for some contract interactions, a reverted call is not an error
export function useHandleError(object, throwOnRevert = true) {
  const errorContext = useErrorContext()
  useEffect(() => {
    if (throwOnRevert) {
      errorContext.addError([object.error])
    }
  }, [object.error])
  return object
}
