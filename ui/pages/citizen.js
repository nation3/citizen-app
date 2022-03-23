import { usePassport } from '../lib/passport-nft'
import { useAccount, useContractRead } from '../lib/use-wagmi'
import Passport from '../components/Passport'

export default function Citizen() {
  const [{ data: account }] = useAccount()

  const [{ data, loading }] = usePassport(account?.address)

  console.log(data)

  return (
    <>
      <div className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto">
        <Passport />
      </div>
    </>
  )
}
