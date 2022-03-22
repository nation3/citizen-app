import { nationRequiredStake } from '../lib/config'
import { useHasPassport } from '../lib/passport-nft'
import { useAccount } from '../lib/use-wagmi'
import Passport from '../components/Passport'

export default function Citizen() {
  const [{ data: accountData }] = useAccount()
  const [{ data: balanceData, loading: balanceLoading }] = useHasPassport(
    accountData?.address
  )
  console.log(balanceData)

  return (
    <>
      <div className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto">
        {balanceLoading ? (
          <button className="btn btn-square btn-ghost btn-disabled btn-lg loading"></button>
        ) : balanceData ? (
          <Passport />
        ) : (
          <div className="hero-content">
            <div className="max-w-md">
              <div className="card md:w-96 bg-base-100 shadow-xl">
                <div className="card-body items-stretch items-center">
                  <h2 className="card-title text-center">
                    Become a Nation3 citizen
                  </h2>
                  <ul className="steps steps-vertical lg:steps-horizontal my-8">
                    <li className="step step-primary">Stake and mint</li>
                    <li className="step">Adore your passport</li>
                  </ul>
                  <p>
                    To become a citizen, you need to mint a passport NFT by
                    locking up {nationRequiredStake} $NATION for a year and
                    renewing your stake over time. This is to make sure all
                    citizens are economically aligned.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
