import { useEffect } from 'react'
import { useErrorContext } from '../components/ErrorProvider'

// For some contract interactions, a reverted call is not an error
export function useHandleError(object: any, throwOnRevert = true) {
  const {addError} = useErrorContext()
  useEffect(() => {
    if (throwOnRevert && object.error) {
      addError([object.error])
    }
  }, [object.error, throwOnRevert, addError])
  return object
}
