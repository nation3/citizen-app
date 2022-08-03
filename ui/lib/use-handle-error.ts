import { useEffect } from 'react'
import { useErrorContext } from '../components/ErrorProvider'

// For some contract interactions, a reverted call is not an error
export function useHandleError(object: any, throwOnRevert = true) {
  const errorContext = useErrorContext()
  useEffect(() => {
    if (throwOnRevert && object.error) {
      errorContext.addError([object.error])
    }
  }, [object.error, throwOnRevert, errorContext])
  return object
}
