export default function MainCard({ children, title, loading, gradientBg }) {
  return (
    <div className="hero h-full">
      {!loading ? (
        <div className="hero-content pb-24 lg:pb-2">
          <div className="max-w-md md:max-w-xl">
            <div
              className={`card min-w-80 md:w-full bg-base-100 shadow-md ${
                gradientBg && 'bg-gradient-to-r from-n3blue to-n3green'
              }`}
            >
              <div className="card-body items-stretch items-center">
                <h2
                  className={`card-title text-center text-3xl font-medium mb-2 ${
                    gradientBg && 'text-white'
                  }`}
                >
                  {title}
                </h2>
                {children}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button className="btn btn-square btn-ghost btn-disabled bg-transparent loading"></button>
      )}
    </div>
  )
}
