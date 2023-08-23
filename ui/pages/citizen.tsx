import Image from 'next/image'
import { useState } from 'react'
// @ts-ignore
import Card from 'react-animated-3d-card'
import { useSignMessage } from 'wagmi'
import { mobilePassportDomain } from '../lib/config'
import { usePassportExpirationDate } from '../lib/passport-expiration-hook'
import {
  usePassport,
} from '../lib/passport-nft'
import { useAccount } from '../lib/use-wagmi'
import Confetti from '../components/Confetti'
import Head from '../components/Head'
import PassportExpiration from '../components/PassportExpiration'
import BallotIcon from '../public/passport/ballot.svg'
import DiscordIcon from '../public/passport/discord.svg'
import AddToWallet from '../public/passport/wallet.svg'

export default function Citizen() {
  const { data: account } = useAccount()
  const { data: passportData } = usePassport(account?.address)
  const [confettiNumber, setConfettiNumber] = useState<Array<Number>>([])

  const addConfetti = () => {
    setConfettiNumber([...confettiNumber, confettiNumber.length])
  }

  const { signMessage: signMessageAndDownloadPass } = useSignMessage({
    message: 'I am the holder of this Nation3 passport',
    onSuccess(data) {
      console.log('signMessageAndDownloadPass data:', data)
      const downloadPassURI: string = `${mobilePassportDomain}/api/downloadPass?address=${account.address}&signature=${data}&platform=Apple`
      console.log('downloadPassURI:', downloadPassURI)
      window.location.href = downloadPassURI
    },
    onError(error) {
      console.error('signMessageAndDownloadPass error:', error)
    },
  })

  const passportExpirationDate = usePassportExpirationDate()

  return (
    <>
      {confettiNumber.map((number: Number) => (
        <Confetti key={number.toString()} />
      ))}
      <Head title="Welcome, citizen" />
      {passportData?.nft ? (
        <div className="w-full h-full max-w-5xl m-auto flex flex-row items-center justify-center">
          <div className="pt-64 pb-24 md:pt-4 lg:pb-2 overflow-auto">
            <h2 className="text-center md:text-left text-3xl font-medium mx-4 lg:mx-32 mb-8">
              Welcome, citizen
            </h2>
            <div className="flex flex-col xl:flex-row justify-between items-center gap-8 px-4 lg:px-0 lg:mx-32">
              <div>
                <Card
                  style={{
                    width: window.innerWidth > 420 ? '390px' : '340px',
                    height: window.innerWidth > 420 ? '450px' : '400px',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => addConfetti()}
                >
                  <Image src={passportData.nft.image} layout="fill" />
                </Card>
              </div>

              <div className="card shadow-md flex flex-row flex-col align-center justify-between gap-2 p-4 bg-white h-fit max-w-sm w-full xl:w-fit">
                <div className="flex xl:flex-col w-full gap-2 justify-center">
                  <button
                    onClick={() => signMessageAndDownloadPass()}
                    className="w-40 xl:w-full"
                  >
                    <Image src={AddToWallet} layout="responsive" />
                  </button>
                  <a
                    className="btn btn-primary gap-2 flex-1"
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://discord.gg/JGfcHKmRMB"
                  >
                    <Image src={DiscordIcon} width={24} height={24} />
                    <span className="hidden xl:block">
                      Access gated channels
                    </span>
                  </a>
                  <a
                    className="btn btn-primary gap-2 flex-1"
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://vote.nation3.org"
                  >
                    <Image src={BallotIcon} width={24} height={24} />
                    <span className="hidden xl:block">Vote on proposals</span>
                  </a>
                </div>
                <PassportExpiration date={passportExpirationDate} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-row items-center justify-center">
          <button className="btn btn-square btn-ghost btn-disabled bg-transparent loading"></button>
        </div>
      )}
    </>
  )
}
