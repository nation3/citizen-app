export default function Home() {
  return (
    <>
      <div className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto relative">
        <div className="hero-content">
          <div className="max-w-md">
            <div className="card w-96 bg-base-100 shadow-xl">
              <div className="card-body items-stretch items-center">
                <h2 className="card-title text-center">Welcome!</h2>
                <p>
                  If you have participated in the $NATION tweetdrop, you can
                  claim here. If not, you can buy $NATION.
                </p>

                <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <button className="btn btn-primary grow">Claim</button>
                    </div>
                    <div className="stat-title">Your claimable</div>
                    <div className="stat-value">5</div>
                    <div className="stat-desc">NATION tokens</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
