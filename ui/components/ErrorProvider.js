import { createContext, useContext, useState, useEffect } from 'react'

const ErrorContext = createContext([])

function ErrorProvider({ children }) {
  const [errors, setErrors] = useState([])
  const addError = (newErrors) => {
    if (newErrors && newErrors[0]) setErrors(newErrors.concat(errors))
  }

  const context = { errors, setErrors, addError }
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

function handleErrors(context, errors) {
  useEffect(() => {
    context.addError(errors)
  }, errors)
}

export { ErrorProvider, useErrorContext, handleErrors }
