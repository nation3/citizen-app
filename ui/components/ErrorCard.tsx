import React from 'react'
import { useErrorContext } from './ErrorProvider'

export default function ErrorCard({ error }: any) {
  const { removeError } = useErrorContext()

  return (
    <div
      className="card shadow-md bg-error text-primary-content
    dark:border-[1px] dark:border-slate-600 dark:bg-slate-800
    dark:text-slate-300"
    >
      <div className="card-body">
        <h2 className="card-title">Oopsie</h2>
        <p>
          {error?.message ||
            error?.reason ||
            error?.data?.message ||
            'Unknown error'}
        </p>
      </div>
      <div
        className="btn btn-sm btn-circle btn-ghost absolute right-6 top-5"
        onClick={() => removeError(error.key)}
      >
        ✕
      </div>
    </div>
  )
}
