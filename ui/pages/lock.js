import {
  SparklesIcon,
  LockClosedIcon,
  ClockIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline'
import { ethers } from 'ethers'
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

const dateToReadable = (date) => {
  return date && date.toISOString().substring(0, 10)
}

const bigNumberToDate = (bigNumber) => {
  return bigNumber && new Date(bigNumber.mul(1000).toNumber())
}

const dateOut = (date, { days, years }) => {
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
  max,
}) => {
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

const calculateVestingStart = ({ nationAmount, veNationAmount, lockTime }) => {
  const fourYears = 31556926000 * 4
  return lockTime - (veNationAmount / nationAmount) * fourYears
}

export default function Lock() {
  const [{ data: account }] = useAccount()

  const [{ data: nationBalance, loading: nationBalanceLoading }] =
    useNationBalance(account?.address)

  const [{ data: veNationBalance, loading: veNationBalanceLoading }] =
    useVeNationBalance(account?.address)

  const [{ data: veNationLock, loading: veNationLockLoading }] =
    useVeNationLock(account?.address)

  const [hasLock, setHasLock] = useState(false)
  useEffect(() => {
    !veNationLockLoading &&
      setHasLock(veNationLock && veNationLock.amount.toString() !== '0')
  }, [veNationLock])

  const [hasExpired, setHasExpired] = useState(false)
  useEffect(() => {
    !veNationLockLoading &&
      setHasExpired(
        veNationLock &&
          !veNationLock.end.isZero() &&
          ethers.BigNumber.from(+new Date()).gte(veNationLock.end.mul(1000))
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
    if (hasLock) {
      !lockAmount &&
        setLockAmount(ethers.utils.formatEther(veNationLock?.amount))
      const origTime = {
        value: veNationLock.end,
        formatted: dateToReadable(bigNumberToDate(veNationLock.end)),
      }
      !lockTime && lockTime.orig
      setLockTime({
        ...origTime,
        orig: origTime,
      })
    }
  }, [hasLock])

  useEffect(() => {
    if (hasLock) {
      setMinMaxLockTime({
        min: dateToReadable(
          dateOut(bigNumberToDate(veNationLock.end), { days: 8 })
        ),
        max: dateToReadable(dateOut(new Date(), { years: 4 })),
      })
      setCanIncrease({
        amount:
          lockAmount &&
          ethers.utils.parseEther(lockAmount).gt(veNationLock.amount),
        time:
          lockTime?.value &&
          lockTime.value.gt(
            +dateOut(bigNumberToDate(veNationLock.end), { days: 7 })
          ),
      })
    } else {
      setMinMaxLockTime({
        min: dateToReadable(oneWeekOut),
        max: dateToReadable(dateOut(new Date(), { years: 4 })),
      })
    }
  }, [hasLock, lockAmount, lockTime])

  const createLock = useVeNationCreateLock(
    lockAmount && ethers.utils.parseEther(lockAmount),
    lockTime.value.div(1000)
  )
  const increaseLock = useVeNationIncreaseLock({
    currentAmount: veNationLock?.amount,
    newAmount:
      lockAmount &&
      veNationLock &&
      ethers.utils.parseEther(lockAmount).sub(veNationLock?.amount),
    currentTime: veNationLock?.end,
    newTime: lockTime?.value.div(1000),
  })
  const withdraw = useVeNationWithdrawLock()

  // $veNATION enables governance, minting passport NFTs and boosting liquidity rewards (up to {veNationRewardsMultiplier}x).{' '}

  return (
    <>
      <Head title="$veNATION" />
      <MainCard title="Lock $NATION to get $veNATION">
        <p className="mb-4">
          $veNATION enables governance and will enable minting passport NFTs.{' '}
          <GradientLink
            text="Learn more"
            href="https://wiki.nation3.org/token/#venation"
            internal={false}
            textSize={'md'}
          ></GradientLink>
        </p>
        {!hasLock ? (
          <>
            <p>
              Your veNATION balance is dynamic and always correlates to the
              remainder of the time lock. As time passes and the remainder of
              time lock decreases, your veNATION balance decreases. If you want
              to increase it, you have to either increase the time lock or add
              more NATION. $NATION balance stays the same.
              <br />
              <br />
              <span className="font-semibold">
                {veNationRequiredStake} $veNATION
              </span>{' '}
              will be needed to mint a passport NFT.
              <br />
              <br />
              Some examples of how to get to {veNationRequiredStake} $veNATION:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>At least {veNationRequiredStake} $NATION locked for 4 years, or</li>
              <li>At least {veNationRequiredStake * 2} $NATION locked for 2 years, or</li>
              <li>At least {veNationRequiredStake * 4} $NATION locked for 1 year</li>
            </ul>
            <div className="alert mb-4">
              <div>
                <InformationCircleIcon className="h-24 w-24 text-n3blue" />
                <span>
                  Make sure to obtain more than {veNationRequiredStake}{' '}
                  $veNATION if you want to mint a passport NFT on launch, since
                  $veNATION balance drops over time. If it falls below 2
                  $veNATION, your passport can be revoked. You can always lock
                  more $NATION later.
                </span>
              </div>
            </div>
          </>
        ) : (
          ''
        )}

        {hasLock && (
          <>
            <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <SparklesIcon className="h-8 w-8" />
                </div>
                <div className="stat-title">Your $veNATION</div>
                <div className="stat-value text-primary">
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
                </div>
              </div>
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <LockClosedIcon className="h-8 w-8" />
                </div>
                <div className="stat-title">Your locked $NATION</div>
                <div className="stat-value text-secondary">
                  <Balance
                    balance={veNationLock?.amount}
                    loading={veNationLockLoading}
                    decimals={2}
                  />
                </div>
              </div>
            </div>
            <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
              <div className="stat">
                <div className="stat-figure">
                  <ClockIcon className="h-8 w-8" />
                </div>
                <div className="stat-title">Your lock expiration date</div>
                <div className="stat-value">
                  {dateToReadable(bigNumberToDate(veNationLock?.end))}
                </div>
              </div>
            </div>
          </>
        )}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="form-control">
              {!hasExpired ? (
                <>
                  <p className="mb-4">
                    Available to lock:{' '}
                    <Balance
                      balance={nationBalance?.formatted}
                      loading={nationBalanceLoading}
                    />{' '}
                    $NATION
                  </p>
                  <label className="label">
                    <span className="label-text">Lock amount</span>
                  </label>
                  <div className="input-group mb-4">
                    <input
                      type="number"
                      placeholder="0"
                      className="input input-bordered w-full"
                      value={lockAmount}
                      min={
                        veNationLock?.amount
                          ? ethers.utils.formatEther(veNationLock?.amount)
                          : 0
                      }
                      onChange={(e) => {
                        setLockAmount(e.target.value)
                        setWantsToIncrease(true)
                      }}
                    />
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setLockAmount(nationBalance?.formatted)
                        setWantsToIncrease(true)
                      }}
                    >
                      Max
                    </button>
                  </div>
                  <label className="label">
                    <span className="label-text">
                      Lock expiration date
                      <br />
                      (min. one week, max four years)
                    </span>
                  </label>
                  <input
                    type="date"
                    placeholder="Expiration date"
                    className="input input-bordered w-full"
                    value={lockTime.formatted}
                    min={minMaxLockTime.min}
                    max={minMaxLockTime.max}
                    onChange={(e) => {
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
                  <TimeRange
                    time={Date.parse(lockTime.formatted)}
                    min={Date.parse(minMaxLockTime.min)}
                    max={Date.parse(minMaxLockTime.max)}
                    displaySteps={!hasLock}
                    onChange={(newDate) => {
                      setLockTime({
                        ...lockTime,
                        formatted: dateToReadable(newDate),
                        value: ethers.BigNumber.from(Date.parse(newDate)),
                      })
                      setWantsToIncrease(true)
                    }}
                  />
                  {wantsToIncrease ? (
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
                    </p>
                  ) : (
                    ''
                  )}

                  <div className="card-actions mt-4">
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
                          veNationLock &&
                          lockAmount &&
                          ethers.utils
                            .parseEther(lockAmount)
                            .sub(veNationLock.amount),
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
                  </div>
                </>
              ) : (
                <>
                  <p>Your previous lock has expired, you need to withdraw </p>
                  <div className="card-actions mt-4">
                    <ActionButton
                      className="btn btn-primary normal-case font-medium w-full"
                      action={withdraw}
                    >
                      Withdraw
                    </ActionButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </MainCard>
    </>
  )
}
