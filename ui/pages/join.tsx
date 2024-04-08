import { LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { ethers } from 'ethers'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useWaitForTransaction } from 'wagmi'
import {
  nationToken,
  balancerDomain,
  nationPassportAgreementStatement,
  nationPassportAgreementURI,
} from '../lib/config'
import { useNationBalance } from '../lib/nation-token'
import { NumberType, transformNumber } from '../lib/numbers'
import { useClaimPassport, useHasPassport, useClaimRequiredBalance } from '../lib/passport-nft'
import { storeSignature, useSignAgreement } from '../lib/sign-agreement'
import { useAccount } from '../lib/use-wagmi'
import { useVeNationBalance } from '../lib/ve-token'
import ActionButton from '../components/ActionButton'
import Balance from '../components/Balance'
import Confetti from '../components/Confetti'
import GradientLink from '../components/GradientLink'
import Head from '../components/Head'
import MainCard from '../components/MainCard'

export default function Join() {
  const { address } = useAccount()
  const { data: nationBalance, isLoading: nationBalanceLoading } =
    useNationBalance(address)
  const { data: veNationBalance, isLoading: veNationBalanceLoading } =
    useVeNationBalance(address)
  const { hasPassport, isLoading: hasPassportLoading } = useHasPassport(address)
  const { data: claimRequiredBalance } = useClaimRequiredBalance()
  const requiredBalance = useMemo(() => {
    return transformNumber(
      claimRequiredBalance,
      NumberType.string,
      0
    ) as number
  }, [claimRequiredBalance])

  const { writeAsync: claim, data: claimData } = useClaimPassport()
  const { isLoading: claimPassportLoading } = useWaitForTransaction({
    hash: claimData?.hash,
  })
  const { isLoading: signatureLoading, signTypedData } = useSignAgreement({
    onSuccess: async (signature: string) => {
      const sigs = ethers.utils.splitSignature(signature)
      const tx = await claim({
        recklesslySetUnpreparedArgs: [sigs.v, sigs.r, sigs.s]
      })


      // The signature will be stored permanently on the Ethereum blockchain,
      // so uploading it to IPFS is only a nice to have
      await storeSignature(signature, tx.hash)
    },
  })

  const signAndClaim = {
    isLoadingOverride: signatureLoading || claimPassportLoading,
    writeAsync: signTypedData,
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

  const [action, setAction] = useState({
    mint: transformNumber(0, NumberType.bignumber),
    lockAndMint: transformNumber(0, NumberType.bignumber),
  })

  useEffect(() => {
    if (!nationBalance || !veNationBalance) return
    setAction({
      mint: veNationBalance.value.gte(
        transformNumber(
          claimRequiredBalance as number,
          NumberType.bignumber
        )
      ),
      lockAndMint: nationBalance.value
        .mul(4)
        .gte(
          transformNumber(
            (claimRequiredBalance as number) / 4,
            NumberType.bignumber
          )
        ),
    })
  }, [
    nationBalance,
    nationBalanceLoading,
    veNationBalance,
    veNationBalanceLoading,
    claimRequiredBalance,
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
            className={`step text-sm ${(action.mint && !hasPassport) || hasPassport ? 'step-primary' : ''
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
                {requiredBalance} $veNATION
              </span>
              . This is to make sure all citizens are economically aligned.
              <br />
              <br />
              Your $NATION won't be taken away from you. As your lock matures,
              you can either withdraw your tokens or increase the lock time to
              keep citizenship. Passport NFTs represent membership and are
              currently not transferable.
              <br />
              <br />
              {nationPassportAgreementStatement}:{' '}
              <GradientLink
                text="Read the terms"
                href={nationPassportAgreementURI}
              />
            </p>

            <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <LockClosedIcon className="h-8 w-8" />
                </div>
                <div className="stat-title">Needed balance</div>
                <div className="stat-value">
                  {requiredBalance}
                </div>
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
                    balance={veNationBalance?.value}
                    decimals={4}
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
                href={`${balancerDomain}/#/trade/ether/${nationToken}`}
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
              We are delighted to welcome you to Nation3 as a fellow citizen.
              You will be taken to your passport in a few seconds ✨
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
