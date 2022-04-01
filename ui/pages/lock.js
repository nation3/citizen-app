import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { nationToken, veNationToken } from '../lib/config'
import { veNationRequiredStake } from '../lib/config'
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
import Head from '../components/Head'
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
  const vestingStart = calculateVestingStart({
    nationAmount,
    veNationAmount,
    lockTime,
  })
  const percentage = (time - vestingStart) / (max - vestingStart)
  return (nationAmount * percentage).toFixed(2)
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

  const hasLock = veNationLock && veNationLock.amount.toString() !== '0'
  const hasExpired =
    hasLock &&
    ethers.BigNumber.from(+new Date()).gte(veNationLock.end.mul(1000))

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
      setMinMaxLockTime({
        min: dateToReadable(
          dateOut(bigNumberToDate(veNationLock.end), { days: 8 })
        ),
        max: dateToReadable(dateOut(new Date(), { years: 4 })),
      })
    } else if (!hasLock) {
      setMinMaxLockTime({
        min: dateToReadable(oneWeekOut),
        max: dateToReadable(dateOut(new Date(), { years: 4 })),
      })
    }
  }, [veNationLock, veNationLockLoading])

  useEffect(() => {
    if (hasLock) {
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
    }
  }, [lockAmount, lockTime])

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

  const loading =
    nationBalanceLoading || veNationBalanceLoading || veNationLockLoading

  return (
    <>
      <Head title="$veNATION" />
      <div className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto">
        {!loading ? (
          <div className="hero-content">
            <div className="max-w-md">
              <div className="card w-80 md:w-96 bg-base-100 shadow-xl">
                <div className="card-body items-stretch items-center">
                  <h2 className="card-title text-center">
                    Lock $NATION to get $veNATION
                  </h2>
                  <p className="mb-4">Learn about $veNATION.</p>
                  {!hasLock ? (
                    <p>
                      To mint a passport NFT, you need {veNationRequiredStake}{' '}
                      $veNATION. $veNATION increases proportionally with the
                      amount of time you lock your $NATION for. Some examples:
                      <ul>
                        <li>1 $NATION locked up for 4 years = 1 $veNATION</li>
                        <li>1 $NATION locked up for 2 years = 0.5 $veNATION</li>
                        <li>1 $NATION locked up for 1 year = 0.25 $veNATION</li>
                      </ul>
                    </p>
                  ) : (
                    ''
                  )}

                  {hasLock && (
                    <>
                      <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                        <div className="stat">
                          <div className="stat-title">
                            Your $veNATION balance
                          </div>
                          <div className="stat-value">
                            <Balance balance={veNationBalance} decimals={4} />
                          </div>
                        </div>
                      </div>
                      <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                        <div className="stat">
                          <div className="stat-title">Your locked $NATION</div>
                          <div className="stat-value">
                            <Balance
                              balance={veNationLock.amount}
                              decimals={4}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                        <div className="stat">
                          <div className="stat-title">
                            Your lock expiration date
                          </div>
                          <div className="stat-value">
                            {dateToReadable(bigNumberToDate(veNationLock.end))}
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
                              <Balance balance={nationBalance?.formatted} />{' '}
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
                                  hasLock
                                    ? ethers.utils.formatEther(
                                        veNationLock?.amount
                                      )
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
                                    ? ethers.BigNumber.from(
                                        Date.parse(e.target.value)
                                      )
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
                                  value: ethers.BigNumber.from(
                                    Date.parse(newDate)
                                  ),
                                })
                                setWantsToIncrease(true)
                              }}
                            />
                            {account && wantsToIncrease ? (
                              <p>
                                Your final balance will be approx{' '}
                                {calculateVeNation({
                                  nationAmount:
                                    lockAmount && veNationLock && +lockAmount,
                                  veNationAmount:
                                    veNationBalance &&
                                    transformNumber(
                                      veNationBalance,
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
                                className={`btn btn-primary w-full ${
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
                                      canIncrease.amount && canIncrease.time
                                        ? '&'
                                        : ''
                                    } ${canIncrease.time ? 'time' : ''}`}
                              </ActionButton>
                            </div>
                          </>
                        ) : (
                          <>
                            <p>
                              Your previous lock has expired, you need to
                              withdraw{' '}
                            </p>
                            <div className="card-actions mt-4">
                              <ActionButton
                                className="btn btn-primary w-full"
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
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button className="btn btn-square btn-ghost btn-disabled loading"></button>
        )}
      </div>
    </>
  )
}
