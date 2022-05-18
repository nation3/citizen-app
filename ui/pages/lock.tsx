import {
  SparklesIcon,
  LockClosedIcon,
  ClockIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline'
import { ethers } from 'ethers'
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { useEffect, useState } from 'react'
import {
  nationToken,
  veNationToken,
  veNationRequiredStake,
  veNationRewardsMultiplier,
} from '../lib/config'
import { useNationBalance } from '../lib/nation-token'
import { transformNumber } from '../lib/numbers'
import { useAccount } from '../lib/use-wagmi'
import {
  useVeNationBalance,
  useVeNationLock,
  useVeNationCreateLock,
  useVeNationIncreaseLock,
  useVeNationWithdrawLock,
} from '../lib/ve-token'
import ActionButton from '../components/ActionButton'
import Balance from '../components/Balance'
import GradientLink from '../components/GradientLink'
import Head from '../components/Head'
import MainCard from '../components/MainCard'
import TimeRange from '../components/TimeRange'

const dateToReadable = (date: any) => {
  return date && date.toISOString().substring(0, 10)
}

const bigNumberToDate = (bigNumber: any) => {
  return bigNumber && new Date(bigNumber.mul(1000).toNumber())
}

const dateOut = (date: any, {
  days,
  years
}: any) => {
  if (!date) return
  let dateOut = date
  days && dateOut.setDate(date.getDate() + days)
  years && dateOut.setFullYear(date.getFullYear() + years)
  return dateOut
}

const calculateVeNation = ({
  nationAmount,
  veNationAmount,
  time,
  lockTime,
  max
}: any) => {
  // @ts-expect-error ts-migrate(2365) FIXME: Operator '>' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
  if (!nationAmount > 0) return 0

  const vestingStart = calculateVestingStart({
    nationAmount,
    veNationAmount,
    lockTime,
  })
  const percentage = (time - vestingStart) / (max - vestingStart)
  const finalVeNationAmount = nationAmount * percentage
  return finalVeNationAmount.toFixed(finalVeNationAmount > 1 ? 2 : 8)
}

const calculateVestingStart = ({
  nationAmount,
  veNationAmount,
  lockTime
}: any) => {
  const fourYears = 31556926000 * 4
  return lockTime - (veNationAmount / nationAmount) * fourYears
}

export default function Lock() {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
  const { data: account } = useAccount()

  const { data: nationBalance, isLoading: nationBalanceLoading } =
    useNationBalance(account?.address)

  const { data: veNationBalance, isLoading: veNationBalanceLoading } =
    useVeNationBalance(account?.address)

  const { data: veNationLock, isLoading: veNationLockLoading } =
    useVeNationLock(account?.address)

  const [hasLock, setHasLock] = useState(false)
  useEffect(() => {
    !veNationLockLoading &&
      setHasLock(veNationLock && !veNationLock[0].isZero())
  }, [veNationLock])

  const [hasExpired, setHasExpired] = useState(false)
  useEffect(() => {
    !veNationLockLoading &&
      setHasExpired(
        veNationLock &&
          !veNationLock[1].isZero() &&
          ethers.BigNumber.from(+new Date()).gte(veNationLock[1].mul(1000))
      )
  }, [veNationLock])

  const [lockAmount, setLockAmount] = useState(0)

  const oneWeekOut = dateOut(new Date(), { days: 7 })

  const [lockTime, setLockTime] = useState({
    value: ethers.BigNumber.from(+oneWeekOut),
    formatted: dateToReadable(oneWeekOut),
  })

  const [minMaxLockTime, setMinMaxLockTime] = useState({})

  const [canIncrease, setCanIncrease] = useState({ amount: true, time: true })
  const [wantsToIncrease, setWantsToIncrease] = useState(false)

  useEffect(() => {
    if (hasLock && veNationLock) {
      !lockAmount && setLockAmount(ethers.utils.formatEther(veNationLock[0]))
      const origTime = {
        value: veNationLock[1],
        formatted: dateToReadable(bigNumberToDate(veNationLock[1])),
      }
      !lockTime && lockTime.orig
      setLockTime({
        ...origTime,
        orig: origTime,
      })
    }
  }, [hasLock, veNationLock])

  useEffect(() => {
    if (hasLock && veNationLock) {
      setMinMaxLockTime({
        min: dateToReadable(
          dateOut(bigNumberToDate(veNationLock[1]), { days: 8 })
        ),
        max: dateToReadable(dateOut(new Date(), { years: 4 })),
      })
      setCanIncrease({
        amount:
          lockAmount && ethers.utils.parseEther(lockAmount).gt(veNationLock[0]),
        time:
          lockTime?.value &&
          lockTime.value.gt(
            +dateOut(bigNumberToDate(veNationLock[1]), { days: 7 })
          ),
      })
    } else {
      setMinMaxLockTime({
        min: dateToReadable(oneWeekOut),
        max: dateToReadable(dateOut(new Date(), { years: 4 })),
      })
    }
  }, [hasLock, lockAmount, lockTime, veNationLock])

  const createLock = useVeNationCreateLock(
    lockAmount && ethers.utils.parseEther(lockAmount),
    lockTime.value.div(1000)
  )
  const increaseLock = useVeNationIncreaseLock({
    currentAmount: veNationLock && veNationLock[0],
    newAmount:
      lockAmount &&
      veNationLock &&
      ethers.utils.parseEther(lockAmount).sub(veNationLock[0]),
    currentTime: veNationLock && veNationLock[1],
    newTime: lockTime?.value.div(1000),
  })

  const withdraw = useVeNationWithdrawLock()

  // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  return <>
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <Head title="$veNATION" />
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <MainCard title="Lock $NATION to get $veNATION">
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <p className="mb-4">
        $veNATION enables governance, minting passport NFTs and boosting
        liquidity rewards (up to {veNationRewardsMultiplier}x).{' '}
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <GradientLink
          text="Learn more"
          href="https://wiki.nation3.org/token/#venation"
          internal={false}
          textSize={'md'}
        ></GradientLink>
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </p>
      {!hasLock ? (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <p>
            Your veNATION balance is dynamic and always correlates to the
            remainder of the time lock. As time passes and the remainder of
            time lock decreases, your veNATION balance decreases. If you want
            to increase it, you have to either increase the time lock or add
            more NATION. $NATION balance stays the same.
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <br />
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <br />
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <span className="font-semibold">
              {veNationRequiredStake} $veNATION
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </span>{' '}
            will be needed to mint a passport NFT.
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <br />
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <br />
            Some examples of how to get to {veNationRequiredStake} $veNATION:
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </p>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <ul className="list-disc list-inside mb-4">
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <li>
              At least {veNationRequiredStake} $NATION locked for 4 years, or
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </li>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <li>
              // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
              At least {veNationRequiredStake * 2} $NATION locked for 2 years,
              or
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </li>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <li>
              // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
              At least {veNationRequiredStake * 4} $NATION locked for 1 year
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </li>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </ul>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div className="alert mb-4">
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div>
              // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <InformationCircleIcon className="h-24 w-24 text-n3blue" />
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <span>
                Make sure to obtain more than {veNationRequiredStake}{' '}
                $veNATION if you want to mint a passport NFT on launch, since
                $veNATION balance drops over time. If it falls below 2
                $veNATION, your passport can be revoked. You can always lock
                more $NATION later.
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </span>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </div>
        </>
      ) : (
        ''
      )}

      {hasLock && (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className="stat">
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-figure text-primary">
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <SparklesIcon className="h-8 w-8" />
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-title">Your $veNATION</div>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-value text-primary">
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Balance
                  balance={veNationBalance}
                  loading={veNationBalanceLoading}
                  decimals={
                    veNationBalance &&
                    veNationBalance.gt(ethers.utils.parseEther('1'))
                      ? 2
                      : 8
                  }
                />
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className="stat">
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-figure text-secondary">
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <LockClosedIcon className="h-8 w-8" />
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-title">Your locked $NATION</div>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-value text-secondary">
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <Balance
                  balance={veNationLock && veNationLock[0]}
                  loading={veNationLockLoading}
                  decimals={2}
                />
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </div>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className="stat">
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-figure">
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <ClockIcon className="h-8 w-8" />
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-title">Your lock expiration date</div>
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="stat-value">
                {veNationLock &&
                  dateToReadable(bigNumberToDate(veNationLock[1]))}
              // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </div>
        </>
      )}
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className="card bg-base-100 shadow">
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className="card-body">
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div className="form-control">
            {!hasExpired ? (
              // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <p className="mb-4">
                  Available to lock:{' '}
                  // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <Balance
                    balance={nationBalance?.formatted}
                    loading={nationBalanceLoading}
                  />{' '}
                  $NATION
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </p>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <label className="label">
                  // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  <span className="label-text">Lock amount</span>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </label>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className="input-group mb-4">
                  // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  <input
                    type="number"
                    placeholder="0"
                    className="input input-bordered w-full"
                    value={lockAmount}
                    min={
                      veNationLock
                        ? ethers.utils.formatEther(veNationLock[0])
                        : 0
                    }
                    onChange={(e: any) => {
                      setLockAmount(e.target.value)
                      setWantsToIncrease(true)
                    }}
                  />
                  // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setLockAmount(nationBalance?.formatted)
                      setWantsToIncrease(true)
                    }}
                  >
                    Max
                  // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  </button>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <label className="label">
                  // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  <span className="label-text">
                    Lock expiration date
                    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <br />
                    (min. one week, max four years)
                  // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  </span>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </label>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <input
                  type="date"
                  placeholder="Expiration date"
                  className="input input-bordered w-full"
                  value={lockTime.formatted}
                  min={minMaxLockTime.min}
                  max={minMaxLockTime.max}
                  onChange={(e: any) => {
                    setLockTime({
                      ...lockTime,
                      formatted: e.target.value
                        ? e.target.value
                        : lockTime.orig.formatted,
                      value: e.target.value
                        ? ethers.BigNumber.from(Date.parse(e.target.value))
                        : lockTime.orig.value,
                    })
                    setWantsToIncrease(!!e.target.value)
                  }}
                />
                // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <TimeRange
                  time={Date.parse(lockTime.formatted)}
                  min={Date.parse(minMaxLockTime.min)}
                  max={Date.parse(minMaxLockTime.max)}
                  displaySteps={!hasLock}
                  onChange={(newDate: any) => {
                    setLockTime({
                      ...lockTime,
                      formatted: dateToReadable(newDate),
                      value: ethers.BigNumber.from(Date.parse(newDate)),
                    })
                    setWantsToIncrease(true)
                  }}
                />
                {wantsToIncrease ? (
                  // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  <p>
                    Your final balance will be approx{' '}
                    {calculateVeNation({
                      nationAmount: lockAmount && +lockAmount,
                      veNationAmount: transformNumber(
                        veNationBalance || 0,
                        'number',
                        18
                      ),
                      time: Date.parse(lockTime.formatted),
                      lockTime: Date.parse(
                        hasLock && lockTime?.orig
                          ? lockTime.orig.formatted
                          : new Date()
                      ),
                      max: Date.parse(minMaxLockTime.max),
                    })}{' '}
                    $veNATION
                  // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  </p>
                ) : (
                  ''
                )}

                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className="card-actions mt-4">
                  // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <ActionButton
                    className={`btn btn-primary normal-case font-medium w-full ${
                      !(canIncrease.amount || canIncrease.time)
                        ? 'btn-disabled'
                        : ''
                    }`}
                    action={hasLock ? increaseLock : createLock}
                    approval={{
                      token: nationToken,
                      spender: veNationToken,
                      amountNeeded:
                        hasLock && veNationLock
                          // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
                          ? transformNumber(lockAmount, 'bignumber').sub(
                              veNationLock[0]
                            )
                          // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
                          : transformNumber(lockAmount, 'bignumber'),
                      approveText: 'Approve $NATION',
                    }}
                  >
                    {!hasLock
                      ? 'Lock'
                      : `Increase lock ${
                          canIncrease.amount ? 'amount' : ''
                        } ${
                          canIncrease.amount && canIncrease.time ? '&' : ''
                        } ${canIncrease.time ? 'time' : ''}`}
                  </ActionButton>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
              </>
            ) : (
              // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <p>Your previous lock has expired, you need to withdraw </p>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className="card-actions mt-4">
                  // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <ActionButton
                    className="btn btn-primary normal-case font-medium w-full"
                    action={withdraw}
                  >
                    Withdraw
                  </ActionButton>
                // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
              </>
            )}
          // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </div>
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
      // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
    </MainCard>
  </>;
}
