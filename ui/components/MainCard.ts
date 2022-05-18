export default function MainCard({
  children,
  title,
  loading,
  gradientBg
}: any) {
  return (
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
    <div className="hero h-full">
      {!loading ? (
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
        <div className="hero-content pb-24 lg:pb-2">
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
          <div className="max-w-md md:max-w-xl">
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
            <div
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
              className={`card min-w-80 md:w-full bg-base-100 shadow-md ${
                gradientBg && 'bg-gradient-to-r from-n3blue to-n3green'
              }`}
            >
              // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
              <div className="card-body items-stretch items-center">
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h2'.
                <h2
                  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
                  className={`card-title text-center text-3xl font-medium mb-2 ${
                    gradientBg && 'text-white'
                  }`}
                // @ts-expect-error ts-migrate(2365) FIXME: Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
                >
                  {title}
                </h2>
                {children}
              // @ts-expect-error ts-migrate(2365) FIXME: Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
              </div>
            </div>
          </div>
        </div>
      ) : (
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'button'.
        <button className="btn btn-square btn-ghost btn-disabled bg-transparent loading"></button>
      )}
    </div>
  )
}
