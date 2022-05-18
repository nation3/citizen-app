// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { useEffect } from 'react'
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/ErrorProvider' was resolved ... Remove this comment to see the full error message
import { useErrorContext } from '../components/ErrorProvider'

// for some contract interactions, a reverted call is not an error
export function useHandleError(object: any, throwOnRevert = true) {
  const errorContext = useErrorContext()
  useEffect(() => {
    if (throwOnRevert) {
      errorContext.addError([object.error])
    }
  }, [object.error])
  return object
}
