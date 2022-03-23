import Image from 'next/image'
import { usePassport } from '../lib/passport-nft'
import { useAccount, useContractRead } from '../lib/use-wagmi'
import Passport from '../components/Passport'
import AddToWallet from '../public/passport/wallet.svg'

export default function Citizen() {
  const [{ data: account }] = useAccount()

  const [{ data, loading }] = usePassport(account?.address)

  return (
    <>
      <div className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto items-center overflow-auto">
        {account ? (
          <div className="flex flex-col">
            <Passport
              holder={
                account.ens?.name
                  ? account.ens?.name
                  : `${account.address.substring(
                      0,
                      6
                    )}...${account.address.slice(-4)}`
              }
            />
            <div className="mt-20 flex justify-center">
              <a href="#">
                <Image src={AddToWallet} width={220} height={68} />
              </a>
            </div>
          </div>
        ) : (
          <button className="btn btn-square btn-ghost btn-disabled btn-lg loading"></button>
        )}
      </div>
    </>
  )
}
