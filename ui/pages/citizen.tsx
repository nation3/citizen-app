import Image from 'next/image'
import { useState } from 'react'
// @ts-ignore
import Card from 'react-animated-3d-card'
import { useSignMessage } from 'wagmi'
import { transformNumber } from '../lib/numbers'
import {
  usePassport,
  usePassportSigner,
  useSetPassportSigner,
} from '../lib/passport-nft'
import { useAccount } from '../lib/use-wagmi'
import ActionButton from '../components/ActionButton'
import Confetti from '../components/Confetti'
import Head from '../components/Head'
import MainCard from '../components/MainCard'
import BallotIcon from '../public/passport/ballot.svg'
import DiscordIcon from '../public/passport/discord.svg'
import AddToWallet from '../public/passport/wallet.svg'

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
      const downloadPassURI: string = `https://passports.nation3.org/api/downloadPass?address=${account.address}&signature=${data}&platform=Apple`
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

  return (
    <>
      {confettiNumber.map((number: Number) => (
        <Confetti key={number.toString()} />
      ))}
      <Head title="Welcome, citizen" />
      <MainCard
        title="Welcome, citizen"
        loading={!account || !passportData?.id || !passportData?.nft}
        maxWidthClassNames="max-w-md md:max-w-3xl"
      >
        <div className="flex flex-col md:flex-row justify-between">
          <div
            style={{
              width: window.innerWidth > 420 ? '390px' : '280px',
            }}
          >
            <Card
              style={{
                width: window.innerWidth > 420 ? '390px' : '280px',
                height: window.innerWidth > 420 ? '450px' : '320px',
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => addConfetti()}
            >
              {passportData?.nft?.image && (
                <Image src={passportData.nft.image} layout="fill" />
              )}
            </Card>
          </div>
          <div className="flex flex-row md:flex-col justify-center items-between content-end mt-8 gap-4">
            <button
              onClick={() => signMessageAndDownloadPass()}
              className="w-40 md:w-full"
            >
              <Image src={AddToWallet} layout="responsive" />
            </button>
            <a
              className="btn btn-primary gap-2"
              rel="noopener noreferrer"
              target="_blank"
              href="https://discord.gg/nation3"
            >
              <Image src={DiscordIcon} width={24} height={24} />
              <span className="hidden md:block">Access gated channels</span>
            </a>
            <a
              className="btn btn-primary gap-2"
              rel="noopener noreferrer"
              target="_blank"
              href="https://vote.nation3.org"
            >
              <Image src={BallotIcon} width={24} height={24} />
              <span className="hidden md:block">Vote on proposals</span>
            </a>
          </div>
        </div>

        <div className="divider"></div>

        <div className="form-control w-full">
          <h2 className="text-xl">Settings</h2>
          <label className="label">
            <span className="label-text">
              Signer account
              <br />
              <span className="text-xs">
                You can specify another account as a signer. This feature will
                be used in the future so you can participate in votes on the go,
                or authenticate yourself at in-person events without carrying
                your main private key.
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
      </MainCard>
    </>
  )
}
