import { useEffect } from 'react'
import { useErrorContext } from '../components/ErrorProvider'

export function useHandleError(
  [{ data, error, loading }, method],
  throwOnRevert = true // for some contract interactions, a reverted call is not an error
) {
  const errorContext = useErrorContext()
  useEffect(() => {
    if (throwOnRevert) {
      errorContext.addError([error])
    }
  }, [error])
  return [{ data, error, loading }, method]
}
