import { createContext, useContext, useState } from 'react'

const ErrorContext = createContext([])

function ErrorProvider({ children }) {
  const [errors, setErrors] = useState([])
  const addError = (error) => {
    if (error) setErrors(errors.concat(error))
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

export { ErrorProvider, useErrorContext }
