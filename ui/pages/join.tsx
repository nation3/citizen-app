import { SparklesIcon, LockClosedIcon } from '@heroicons/react/outline'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { veNationRequiredStake, nationToken } from '../lib/config'
import { useNationBalance } from '../lib/nation-token'
import { useClaimPassport } from '../lib/passport-nft'
import { useHasPassport } from '../lib/passport-nft'
import { useAccount } from '../lib/use-wagmi'
import { useVeNationBalance } from '../lib/ve-token'
import ActionButton from '../components/ActionButton'
import Balance from '../components/Balance'
import Confetti from '../components/Confetti'
import Head from '../components/Head'
import MainCard from '../components/MainCard'
import { NumberType, transformNumber } from '../lib/numbers'
import { useSignAgreement, storeSignature } from '../lib/sign-agreement'
import { useErrorContext } from '../components/ErrorProvider'

export default function Join() {
  const errorContext = useErrorContext()

  const { data: account } = useAccount()
  const { data: nationBalance, isLoading: nationBalanceLoading } =
    useNationBalance(account?.address)
  const { data: veNationBalance, isLoading: veNationBalanceLoading } =
    useVeNationBalance(account?.address)
  const { data: hasPassport, isLoading: hasPassportLoading } = useHasPassport(
    account?.address
  )

  const { isLoading: claimPassportLoading, write: claim } = useClaimPassport()
  const { isLoading: signatureLoading, signMessage } = useSignAgreement({onSuccess: async (signature: string) => {
    console.log(ethers.utils.splitSignature(signature))
    const tx = await claim({args: [ethers.utils.splitSignature(signature)]})
    const { error } = await storeSignature(signature, tx.hash)
    if (error) {
      errorContext.addError([{message: error}])
    }
  }})
  
  const signAndClaim = {
    isLoading: signatureLoading || claimPassportLoading,
    write: signMessage
  }

  const router = useRouter()

  const changeUrl = () => {
    router.replace('/join?mintingPassport=1', undefined, { shallow: true })
  }

  useEffect(() => {
    if (hasPassport) {
      setTimeout(() => {
        router.push('/citizen')
      }, 5000)
    }
  }, [hasPassport, hasPassportLoading, router])

  const [action, setAction] = useState({mint: transformNumber(0, NumberType.bignumber), lockAndMint: transformNumber(0, NumberType.bignumber)})

  useEffect(() => {
    if (!nationBalance || !veNationBalance) return
    setAction({
      mint: veNationBalance.gte(
        transformNumber(veNationRequiredStake as unknown as number, NumberType.bignumber)
      ),
      // mint: true,
      lockAndMint: nationBalance.value
        .mul(4)
        .gte(transformNumber(veNationRequiredStake as unknown as number/4, NumberType.bignumber)),
    })
  }, [
    nationBalance,
    nationBalanceLoading,
    veNationBalance,
    veNationBalanceLoading,
  ])

  return (
    <>
      <Head title="Become a citizen" />
      {hasPassport && <Confetti />}
      <MainCard title="Become a Nation3 citizen">
        <ul className="steps steps-vertical lg:steps-horizontal my-8">
          <li className={`step text-sm ${action.mint ? 'step-primary' : ''}`}>
            Lock $NATION
          </li>
          <li
            className={`step text-sm ${
              action.mint && !hasPassport ? 'step-primary' : ''
            }`}
          >
            Claim passport
          </li>
          <li className={`step text-sm ${hasPassport ? 'step-primary' : ''}`}>
            Adore your passport
          </li>
        </ul>

        {!hasPassport ? (
          <>
            <p>
              To become a citizen, you need to mint a passport NFT by holding at
              least{' '}
              <span className="font-semibold">
                {veNationRequiredStake} $veNATION
              </span>
              . This is to make sure all citizens are economically aligned
              <br />
              <br />
              Your $veNATION won't be taken away from you. When your lock
              expires, you can either withdraw them or increase the lock to keep
              citizenship.
            </p>

            <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <LockClosedIcon className="h-8 w-8" />
                </div>
                <div className="stat-title">Needed balance</div>
                <div className="stat-value">{veNationRequiredStake}</div>
                <div className="stat-desc">$veNATION</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <SparklesIcon className="h-8 w-8" />
                </div>
                <div className="stat-title">Your balance</div>
                <div className="stat-value">
                  <Balance
                    loading={veNationBalanceLoading}
                    balance={veNationBalance}
                    decimals={2}
                  />
                </div>
                <div className="stat-desc">$veNATION</div>
              </div>
            </div>
            {action.mint ? (
              <ActionButton
                className="btn btn-primary normal-case font-medium grow"
                action={signAndClaim}
                preAction={changeUrl}
              >
                Claim
              </ActionButton>
            ) : action.lockAndMint ? (
              <>
                <Link href="/lock" passHref>
                  <button className="btn btn-primary normal-case font-medium grow">
                    Lock $NATION
                  </button>
                </Link>
              </>
            ) : (
              <a
                className="btn btn-primary normal-case font-medium grow"
                href={`https://app.balancer.fi/#/trade/ether/${nationToken}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Buy $NATION
              </a>
            )}
          </>
        ) : (
          <>
            <p>
              We are delighted to welcome you to Nation3 as a fellow citizen. You
              will be taken to your passport in a few seconds ✨
            </p>
            <div className="flex place-content-center">
              <button className="btn btn-square btn-ghost btn-disabled btn-lg bg-transparent loading"></button>
            </div>
          </>
        )}
      </MainCard>
    </>
  )
}
