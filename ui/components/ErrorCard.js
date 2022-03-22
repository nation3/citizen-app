import { useErrorContext } from './ErrorProvider'

export default function ErrorCard({ error }) {
  const { removeError } = useErrorContext()

  return (
    <div className="card shadow-md bg-error text-primary-content">
      <div className="card-body">
        <h2 className="card-title">Error: {error?.message || error?.reason}</h2>
        <p>{error?.data?.message}</p>
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
