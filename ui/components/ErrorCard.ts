// @ts-expect-error ts-migrate(6142) FIXME: Module './ErrorProvider' was resolved to '/Users/g... Remove this comment to see the full error message
import { useErrorContext } from './ErrorProvider'

export default function ErrorCard({
  error
}: any) {
  const { removeError } = useErrorContext()

  return (
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
    <div className="card shadow-md bg-error text-primary-content">
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
      <div className="card-body">
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h2'.
        <h2 className="card-title">Oopsie</h2>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'p'.
        <p>
          // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'message'. Did you mean 'onmessag... Remove this comment to see the full error message
          {error?.message ||
            error?.reason ||
            error?.data?.message ||
            'Unknown error'}
        </p>
      </div>
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
      <div
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
        className="btn btn-sm btn-circle btn-ghost absolute right-6 top-5"
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'onClick'.
        onClick={() => removeError(error.key)}
      >
        ✕
      </div>
    </div>
  )
}
