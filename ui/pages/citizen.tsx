import Image from 'next/image'
import { useState } from 'react'
import { useEnsName } from 'wagmi'
import { usePassport } from '../lib/passport-nft'
import { useAccount } from '../lib/use-wagmi'
import Confetti from '../components/Confetti'
import Head from '../components/Head'
import Passport from '../components/Passport'
import AddToWallet from '../public/passport/wallet.svg'

export default function Citizen() {
  const { data: account } = useAccount()

  const { data: ensName } = useEnsName({ address: account?.address })

  const { data: passportData } = usePassport(account?.address)

  const [confettiNumber, setConfettiNumber] = useState<Array<Number>>([])

  const addConfetti = () => {
    setConfettiNumber([...confettiNumber, confettiNumber.length])
  }

  return (
    <>
      {confettiNumber.map((number: Number) => (
        <Confetti key={number.toString()} />
      ))}
      <Head title="Welcome, citizen" />
      <div className="hero h-full">
        {account && passportData?.id ? (
          <div className="flex flex-col items-center justify-center">
            <div
              style={{
                width: window.innerWidth > 390 ? '390px' : '320px',
              }}
            >
              <Passport
                holder={
                  ensName
                    ? ensName
                    : `${account.address.substring(
                        0,
                        6
                      )}...${account.address.slice(-4)}`
                }
                id={passportData.id}
                onClick={() => addConfetti()}
              />
            </div>

            <div className="stats shadow mt-20">
              <a
                className="stat"
                rel="noopener noreferrer"
                target="_blank"
                href=""
              >
                <div className="stat-title">Access gated channels on</div>
                <div className="stat-value text-indigo-500">Discord</div>
              </a>

              <a
                className="stat"
                rel="noopener noreferrer"
                target="_blank"
                href=""
              >
                <div className="stat-title">Vote on</div>
                <div className="stat-value text-yellow-400">Snapshot</div>
              </a>
            </div>
            <div className="mt-8 flex flex-col text-center justify-center">
              <p className="mb-2">And, coming soon...</p>
              <a href="#" onClick={() => alert('Coming soon!')}>
                <Image src={AddToWallet} width={220} height={68} />
              </a>
            </div>
          </div>
        ) : (
          <button className="btn btn-square btn-ghost btn-disabled btn-lg bg-transparent loading"></button>
        )}
      </div>
    </>
  )
}
