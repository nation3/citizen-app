import { useEffect } from 'react'
import { useErrorContext } from '../components/ErrorProvider'

export function useHandleError(object) {
  const errorContext = useErrorContext()
  useEffect(() => {
    console.log(object.error)
    errorContext.addError([object.error])
  }, [object.error])
  return object
}
