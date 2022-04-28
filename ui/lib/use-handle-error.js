import { useEffect } from 'react'
import { useErrorContext } from '../components/ErrorProvider'

export function useHandleError({ data, error, isLoading, refetch }) {
  const errorContext = useErrorContext()
  useEffect(() => {
    errorContext.addError([error])
  }, [error])
  return [{ data, error, loading: isLoading }, refetch]
}
