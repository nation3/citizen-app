import { useEffect } from 'react'
import { useErrorContext } from '../components/ErrorProvider'

export function useHandleError([{ data, error, loading }, method]) {
  const errorContext = useErrorContext()
  useEffect(() => {
    errorContext.addError([error])
  }, [error])
  return [{ data, error, loading }, method]
}
