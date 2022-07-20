import { usePassport, useAccount } from '@nation3/utils'
import Image from 'next/image'
import { useState } from 'react'
// @ts-ignore
import Card from 'react-animated-3d-card'
import { useSignMessage } from 'wagmi'
import Confetti from '../components/Confetti'
import Head from '../components/Head'
import AddToWallet from '../public/passport/wallet.svg'

export default function Citizen() {
  const { data: account } = useAccount()
  const { data: passportData } = usePassport(account?.address ?? '')
  const [confettiNumber, setConfettiNumber] = useState<Array<Number>>([])

  const addConfetti = () => {
    setConfettiNumber([...confettiNumber, confettiNumber.length])
  }

  const { signMessage: signMessageAndDownloadPass } = useSignMessage({
    message: 'I am the holder of this Nation3 passport',
    onSuccess(data) {
      console.log('signMessageAndDownloadPass data:', data)
      const downloadPassURI: string = `https://passports.nation3.org/api/downloadPass?address=${account?.address}&signature=${data}&platform=Apple`
      console.log('downloadPassURI:', downloadPassURI)
      window.location.href = downloadPassURI
    },
    onError(error) {
      console.error('signMessageAndDownloadPass error:', error)
    },
  })

  return (
    <>
      {confettiNumber.map((number: Number) => (
        <Confetti key={number.toString()} />
      ))}
      <Head title="Welcome, citizen" />
      <div className="hero h-full">
        <div className="hero-content pb-24 lg:pb-2">
          {account && passportData?.id && passportData?.nft ? (
            <div className="flex flex-col items-center justify-center">
              <div
                style={{
                  width: window.innerWidth > 390 ? '390px' : '320px',
                }}
              >
                <Card
                  style={{
                    width: window.innerWidth > 390 ? '390px' : '320px',
                    height: window.innerWidth > 390 ? '450px' : '369px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => addConfetti()}
                >
                  <Image src={passportData.nft.image} layout="fill" />
                </Card>
              </div>

              <div className="stats stats-vertical md:stats-horizontal shadow mt-20">
                <a
                  className="stat"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://discord.gg/nation3"
                >
                  <div className="stat-title">Access gated channels on</div>
                  <div className="stat-value text-indigo-500">Discord</div>
                </a>

                <a
                  className="stat"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://vote.nation3.org"
                >
                  <div className="stat-title">Vote on</div>
                  <div className="stat-value text-yellow-400">Snapshot</div>
                </a>
              </div>
              <div className="mt-8 flex flex-col text-center justify-center">
                <button onClick={() => signMessageAndDownloadPass()}>
                  <Image src={AddToWallet} width={220} height={68} />
                </button>
              </div>
            </div>
          ) : (
            <button className="btn btn-square btn-ghost btn-disabled btn-lg bg-transparent loading"></button>
          )}
        </div>
      </div>
    </>
  )
}
