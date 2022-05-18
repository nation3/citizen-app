// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { useState, useEffect } from 'react'
import { nationDropAmount, nationToken } from '../lib/config'
import {
  useClaimsFiles,
  checkEligibility,
  useIsClaimed,
  useClaimDrop,
} from '../lib/merkle-drop'
import { useHandleError } from '../lib/use-handle-error'
import { useAccount } from '../lib/use-wagmi'
import ActionButton from '../components/ActionButton'
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/Confetti' was resolved to '/... Remove this comment to see the full error message
import Confetti from '../components/Confetti'
import Head from '../components/Head'
import MainCard from '../components/MainCard'

export default function Claim() {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
  const { data: account } = useAccount()
  const [canClaim, setCanClaim] = useState(false)
  const [contractId, setContractId] = useState(0)
  const [proofIndex, setProofIndex] = useState()
  const [justClaimed, setJustClaimed] = useState(false)

  const { data: claimsFiles } = useHandleError(useClaimsFiles())
  const { data: isClaimed, isLoading: isClaimedLoading } = useIsClaimed(
    contractId,
    proofIndex
  )

  useEffect(() => {
    if (account && claimsFiles) {
      const [id, index] = checkEligibility(claimsFiles, account.address)
      if (typeof index === 'number') {
        setContractId(id)
        setProofIndex(index)
        typeof isClaimed !== 'undefined' && setCanClaim(!isClaimed)
      }
    }
  }, [account, claimsFiles, isClaimed, isClaimedLoading])

  const claimDrop = useClaimDrop({
    contractId: contractId,
    index: proofIndex,
    account: account?.address,
    amount:
      canClaim && claimsFiles
        ? claimsFiles[contractId].claims[account?.address]?.amount
        : 0,
    proof:
      canClaim && claimsFiles
        ? claimsFiles[contractId].claims[account?.address]?.proof
        : {},
  })

  return (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <>
      // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      <Head title="Claim your $NATION" />
      // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
      {justClaimed && <Confetti />}
      {!justClaimed ? (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <MainCard title="$NATION tweetdrop">
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <p>
            {!account
              ? `Connect your account to see if you are eligible ⚡️`
              : canClaim
              ? `You are eligible to claim ${nationDropAmount} $NATION 🎉`
              : `If you have participated in the $NATION tweetdrop, you can
                      claim here. If not, you can buy $NATION.`}
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </p>

          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className="stat">
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-figure text-secondary">
                {canClaim ? (
                  // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <ActionButton
                    className="btn btn-primary normal-case font-medium grow"
                    action={claimDrop}
                    postAction={() => setJustClaimed(true)}
                  >
                    Claim
                  </ActionButton>
                ) : (
                  // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  <a
                    className="btn btn-primary normal-case font-medium grow"
                    href={`https://app.balancer.fi/#/trade/ether/${nationToken}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Buy $NATION
                  // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  </a>
                )}
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-title">Your claimable</div>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-value">
                {canClaim ? nationDropAmount : 0}
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-desc">$NATION</div>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </div>
        </MainCard>
      ) : (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <MainCard title="Welcome new $NATION holder!" gradientBg={true}>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <p className="text-white">
            Your $NATION was claimed successfully! 🎉
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </p>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <p className="text-white">
            Go lock your $NATION for $veNATION so you can get yourself a Genesis
            passport on launch and become a citizen of Nation3!
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </p>
        </MainCard>
      )}
    </>
  )
}
