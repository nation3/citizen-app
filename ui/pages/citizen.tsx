import Image from 'next/image'
import { useState } from 'react'
// @ts-ignore
import Card from 'react-animated-3d-card'
import { useSignMessage } from 'wagmi'
import ActionButton from '../components/ActionButton'
import Confetti from '../components/Confetti'
import Head from '../components/Head'
import PassportExpiration from '../components/PassportExpiration'
import { usePassportExpirationDate } from '../lib/passport-expiration-hook'
import {
  usePassport,
  usePassportSigner,
  useSetPassportSigner
} from '../lib/passport-nft'
import { useAccount } from '../lib/use-wagmi'
import BallotIcon from '../public/passport/ballot.svg'
import DiscordIcon from '../public/passport/discord.svg'
import AddToWallet from '../public/passport/wallet.svg'
import { mobilePassportDomain } from '../lib/config'

export default function Citizen() {
  const { data: account } = useAccount()
  const { data: passportData } = usePassport(account?.address)
  const { data: passportSignerData } = usePassportSigner(passportData?.id)
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

  const [passportSigner, setPassportSigner] = useState(passportSignerData)
  const updatePassportSigner = useSetPassportSigner(
    passportData?.id,
    passportSigner
  )

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
              <div className="card shadow-md flex flex-row xl:flex-col justify-between gap-4 p-4 bg-white h-fit max-w-sm w-full xl:w-fit">
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
                  href="https://discord.gg/nation3"
                >
                  <Image src={DiscordIcon} width={24} height={24} />
                  <span className="hidden xl:block">Access gated channels</span>
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
                <PassportExpiration date={passportExpirationDate} />
              </div>
            </div>
            <div className="card shadow-md p-4 bg-white mt-8 mx-4 lg:mx-32 max-w-sm xl:max-w-full">
              <div className="form-control w-full">
                <h2 className="text-xl">Settings</h2>
                <label className="label">
                  <span className="label-text">
                    Signer account
                    <br />
                    <span className="text-xs">
                      You can specify another account as a signer. This feature
                      will be used in the future so you can participate in votes
                      on the go, or authenticate yourself at in-person events
                      without carrying your main private key.
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Passport signer"
                  className="input input-bordered w-full"
                  value={passportSigner}
                  onChange={(e: any) => {
                    setPassportSigner(e.target.value)
                  }}
                />

                <div className="card-actions mt-4">
                  <ActionButton
                    className="btn btn-primary normal-case font-medium w-full"
                    action={updatePassportSigner}
                  >
                    Set passport signer
                  </ActionButton>
                </div>
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
