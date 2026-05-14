import {
  ClockIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { BigNumber, ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { nationToken, veNationToken } from '../lib/config'
import { dateToReadable } from '../lib/date'
import { useNationBalance } from '../lib/nation-token'
import { NumberType, transformNumber } from '../lib/numbers'
import { useAccount } from '../lib/use-wagmi'
import { useClaimRequiredBalance } from '../lib/passport-nft'
import {
  useVeNationBalance,
  useVeNationCreateLock,
  useVeNationIncreaseLock,
  useVeNationLock,
  useVeNationWithdrawLock,
} from '../lib/ve-token'
import ActionButton, { ActionButtonProps } from '../components/ActionButton'
import Balance from '../components/Balance'
import EthersInput from '../components/EthersInput'
import GradientLink from '../components/GradientLink'
import Head from '../components/Head'
import MainCard from '../components/MainCard'
import TimeRange from '../components/TimeRange'

const bigNumberToDate = (bigNumber: any) => {
  return bigNumber && new Date(bigNumber.mul(1000).toNumber())
}

const dateOut = (date: any, { days, years }: any) => {
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
}: any) => {
  if (!nationAmount) return 0

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
  lockTime,
}: any) => {
  const fourYears = 31556926000 * 4
  return lockTime - (veNationAmount / nationAmount) * fourYears
}

const passportSafetyWindowMs = 90 * 24 * 60 * 60 * 1000

const formatPassportSafetyNumber = (value?: number) => {
  if (value == null || !Number.isFinite(value)) return '...'
  return value >= 1 ? value.toFixed(2) : value.toFixed(4)
}

const formatPassportSafetyDate = (time?: number) => {
  if (!time || !Number.isFinite(time)) return 'Set amount and date'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(time))
}

const getPassportSafety = ({
  projectedVeNation,
  requiredBalance,
  lockEndTime,
  now = Date.now(),
}: {
  projectedVeNation?: number
  requiredBalance?: number
  lockEndTime?: number
  now?: number
}) => {
  if (requiredBalance == null || requiredBalance < 0) {
    return {
      status: 'Loading threshold',
      statusClass: 'badge-ghost',
      dropDate: 'Loading threshold',
      buffer: undefined,
      projected: undefined,
      threshold: undefined,
    }
  }

  if (
    projectedVeNation == null ||
    !Number.isFinite(projectedVeNation) ||
    !lockEndTime ||
    !Number.isFinite(lockEndTime)
  ) {
    return {
      status: 'Enter amount and date',
      statusClass: 'badge-ghost',
      dropDate: 'Set amount and date',
      buffer: undefined,
      projected: projectedVeNation,
      threshold: requiredBalance,
    }
  }

  const buffer = projectedVeNation - requiredBalance
  if (buffer <= 0) {
    return {
      status: 'Below threshold',
      statusClass: 'badge-warning',
      dropDate: 'Already below threshold',
      buffer,
      projected: projectedVeNation,
      threshold: requiredBalance,
    }
  }

  const dropTime =
    projectedVeNation > 0
      ? now + (1 - requiredBalance / projectedVeNation) * (lockEndTime - now)
      : undefined
  const dropsSoon =
    dropTime != null &&
    Number.isFinite(dropTime) &&
    dropTime - now <= passportSafetyWindowMs

  return {
    status: dropsSoon ? 'At risk soon' : 'Safe for now',
    statusClass: dropsSoon ? 'badge-warning' : 'badge-info',
    dropDate: formatPassportSafetyDate(dropTime),
    buffer,
    projected: projectedVeNation,
    threshold: requiredBalance,
  }
}

export default function Lock() {
  const { address } = useAccount()

  const { data: nationBalance, isLoading: nationBalanceLoading } =
    useNationBalance(address)

  const { data: veNationBalance, isLoading: veNationBalanceLoading } =
    useVeNationBalance(address)

  const { data: claimRequiredBalance, isLoading: claimRequiredBalanceLoading } =
    useClaimRequiredBalance()
  const requiredBalance = useMemo(() => {
    if (claimRequiredBalanceLoading) {
      return -1
    }
    return transformNumber(claimRequiredBalance, NumberType.string, 0) as number
  }, [claimRequiredBalance, claimRequiredBalanceLoading])

  const { data: veNationLock, isLoading: veNationLockLoading } =
    useVeNationLock(address)

  const [hasLock, setHasLock] = useState<boolean>()
  useEffect(() => {
    !veNationLockLoading && setHasLock(veNationLock && veNationLock[0] != 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [veNationLock])

  const [hasExpired, setHasExpired] = useState<boolean>()
  useEffect(() => {
    !veNationLockLoading &&
      setHasExpired(
        veNationLock &&
          veNationLock[1] != 0 &&
          ethers.BigNumber.from(Date.now()).gte(veNationLock[1].mul(1000)),
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [veNationLock])

  const [lockAmount, setLockAmount] = useState<string>('')

  const oneWeekOut = useMemo(() => dateOut(new Date(), { days: 7 }), [])

  const [lockTime, setLockTime] = useState({
    value: ethers.BigNumber.from(+oneWeekOut),
    formatted: dateToReadable(oneWeekOut),
  } as any)

  const [minMaxLockTime, setMinMaxLockTime] = useState({} as any)

  const [canIncrease, setCanIncrease] = useState({ amount: true, time: true })
  const [wantsToIncrease, setWantsToIncrease] = useState(false)

  useEffect(() => {
    if (hasLock && veNationLock && !wantsToIncrease) {
      !lockAmount && setLockAmount(ethers.utils.formatEther(veNationLock[0]))
      const origTime = {
        value: veNationLock[1],
        formatted: dateToReadable(bigNumberToDate(veNationLock[1])),
      }
      !lockTime.orig &&
        setLockTime({
          ...origTime,
          orig: origTime,
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLock, veNationLock])

  useEffect(() => {
    if (hasLock && veNationLock) {
      const originalLockDate = dateToReadable(bigNumberToDate(veNationLock[1]))
      setMinMaxLockTime({
        min: originalLockDate,
        max: dateToReadable(dateOut(new Date(), { years: 4 })),
      })
      setCanIncrease({
        amount: (lockAmount &&
          ethers.utils.parseEther(lockAmount).gt(veNationLock[0])) as boolean,
        time:
          lockTime?.value &&
          lockTime.value.gt(
            +dateOut(bigNumberToDate(veNationLock[1]), { days: 7 }),
          ),
      })
    } else {
      setMinMaxLockTime({
        min: dateToReadable(oneWeekOut),
        max: dateToReadable(dateOut(new Date(), { years: 4 })),
      })
    }
  }, [hasLock, lockAmount, lockTime, veNationLock, oneWeekOut])

  const createLock = useVeNationCreateLock(
    lockAmount && ethers.utils.parseEther(lockAmount),
    lockTime.value.div(1000),
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

  const approval = useMemo<ActionButtonProps['approval']>(
    () => ({
      token: nationToken,
      spender: veNationToken,
      amountNeeded:
        hasLock && veNationLock && veNationLock[0]
          ? (
              transformNumber(
                lockAmount ?? '0',
                NumberType.bignumber,
              ) as BigNumber
            ).sub(veNationLock[0])
          : transformNumber(lockAmount ?? '0', NumberType.bignumber),
      approveText: 'Approve $NATION',
      allowUnlimited: false,
    }),
    [hasLock, veNationLock, lockAmount],
  )

  const projectedVeNation = useMemo(() => {
    const nationAmount = Number(lockAmount)
    const selectedLockTime = Date.parse(lockTime?.formatted)
    const maxLockTime = Date.parse(minMaxLockTime?.max)

    if (
      !nationAmount ||
      nationAmount <= 0 ||
      !Number.isFinite(selectedLockTime) ||
      !Number.isFinite(maxLockTime)
    ) {
      return undefined
    }

    const projected = Number(
      calculateVeNation({
        nationAmount,
        veNationAmount: transformNumber(
          veNationBalance?.value || 0,
          NumberType.number,
        ),
        time: selectedLockTime,
        lockTime: Date.parse(new Date().toString()),
        max: maxLockTime,
      }),
    )

    return Number.isFinite(projected) ? projected : undefined
  }, [lockAmount, lockTime?.formatted, minMaxLockTime?.max, veNationBalance])

  const passportSafety = useMemo(
    () =>
      getPassportSafety({
        projectedVeNation,
        requiredBalance:
          requiredBalance == -1 ? undefined : Number(requiredBalance),
        lockEndTime: Date.parse(lockTime?.formatted),
      }),
    [projectedVeNation, requiredBalance, lockTime?.formatted],
  )

  return (
    <>
      <Head title="$veNATION" />

      <MainCard
        title="Lock $NATION to get $veNATION"
        maxWidthClassNames="w-[calc(100vw-2rem)] max-w-md md:max-w-xl"
      >
        <div className="w-full min-w-0">
          <p className="mb-4 dark:text-slate-300">
            $veNATION enables governance and minting passport NFTs.{' '}
            <GradientLink
              text="Learn more"
              href="https://wiki.nation3.org/token/#venation"
              internal={false}
              textSize={'md'}
            ></GradientLink>
          </p>
          {!hasLock ? (
            <>
              <p className="mb-4 dark:text-slate-300">
                Your veNATION balance is dynamic and always correlates to the
                remainder of the time lock. As time passes and the remainder of
                time lock decreases, your veNATION balance decreases. If you
                want to increase it, you have to either increase the time lock
                or add more NATION. $NATION balance stays the same.
                <br />
                <br />
                <span className="font-semibold">
                  {requiredBalance == -1 ? '...' : requiredBalance} $veNATION
                </span>{' '}
                will be needed to mint a passport NFT.
                <br />
                <br />
                Some examples of how to get to{' '}
                {requiredBalance == -1 ? '...' : requiredBalance} $veNATION:
              </p>

            <ul className="list-disc list-inside mb-4 dark:text-slate-200">
              <li>
                At least {requiredBalance == -1 ? '...' : requiredBalance}{' '}
                $NATION locked for 4 years, or
              </li>

              <li>
                At least {requiredBalance == -1 ? '...' : requiredBalance * 2}{' '}
                $NATION locked for 2 years, or
              </li>

              <li>
                At least {requiredBalance == -1 ? '...' : requiredBalance * 4}{' '}
                $NATION locked for 1 year
              </li>
            </ul>

            <div className="alert mb-4  dark:bg-slate-300">
              <div>
                <InformationCircleIcon className="h-24 w-24 text-n3blue  dark:text-blue-600" />
                <span>
                  We suggest you obtain <b>more than</b>{' '}
                  {(requiredBalance == -1 ? '...' : requiredBalance) || 0 + 0.5}{' '}
                  $veNATION if you want to mint a passport NFT, since the
                  $veNATION balance drops over time. If it falls below the
                  required threshold, your passport can be revoked. You can
                  always lock more $NATION later.
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
                    balance={veNationBalance?.value}
                    loading={veNationBalanceLoading}
                    decimals={
                      veNationBalance &&
                      veNationBalance.value.gt(ethers.utils.parseEther('1'))
                        ? 2
                        : 6
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
                    balance={veNationLock && veNationLock[0]}
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
                  {veNationLock &&
                    dateToReadable(bigNumberToDate(veNationLock[1]))}
                </div>
              </div>
            </div>
          </>
        )}

        {!hasExpired && (
          <div className="mb-4 rounded-lg border border-n3blue bg-n3blue-100/60 p-4 text-sm shadow-sm dark:bg-slate-300">
            <div className="mb-3 flex items-center gap-2 font-semibold text-base-content">
              <ShieldCheckIcon className="h-5 w-5 text-n3blue dark:text-blue-600" />
              <span>Passport safety</span>
            </div>

            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white dark:divide-slate-300 dark:border-slate-300 dark:bg-slate-100">
              <div className="grid gap-1 px-3 py-3 md:grid-cols-[1fr_auto] md:items-center">
                <span className="text-slate-600">Projected $veNATION now</span>
                <span className="font-semibold text-slate-900">
                  {formatPassportSafetyNumber(passportSafety.projected)} /{' '}
                  {formatPassportSafetyNumber(passportSafety.threshold)}{' '}
                  threshold
                  {passportSafety.buffer != null && (
                    <span
                      className={`ml-2 ${
                        passportSafety.buffer > 0
                          ? 'text-emerald-600'
                          : 'text-amber-700'
                      }`}
                    >
                      ({passportSafety.buffer > 0 ? '+' : ''}
                      {formatPassportSafetyNumber(passportSafety.buffer)}{' '}
                      buffer)
                    </span>
                  )}
                </span>
              </div>

              <div className="grid gap-1 px-3 py-3 md:grid-cols-[1fr_auto] md:items-center">
                <span className="text-slate-600">
                  Estimated threshold drop date
                </span>
                <span className="font-semibold text-slate-900">
                  {passportSafety.dropDate}
                </span>
              </div>

              <div className="grid gap-1 px-3 py-3 md:grid-cols-[1fr_auto] md:items-center">
                <span className="text-slate-600">Status</span>
                <span
                  className={`badge ${passportSafety.statusClass} justify-self-start md:justify-self-end`}
                >
                  {passportSafety.status}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="card bg-base-100 shadow overflow-visible dark:bg-slate-300">
          <div className="card-body">
            <div className="form-control">
              {!hasExpired ? (
                <>
                  <p className="mb-4 ">
                    Available to lock:{' '}
                    <Balance
                      balance={nationBalance?.formatted}
                      loading={nationBalanceLoading}
                    />{' '}
                    $NATION
                  </p>
                  <label className="label">
                    <span className="label-text">
                      Lock amount
                      <br />
                      <span className="text-xs">
                        This is the final total amount. To increase it, enter
                        your current amount plus the amount you want to
                        increase.
                      </span>
                    </span>
                  </label>
                  <div className="input-group mb-4">
                    <EthersInput
                      type="number"
                      placeholder="0"
                      id="lockAmount"
                      className="input input-bordered w-full dark:bg-slate-200"
                      value={lockAmount}
                      min={
                        veNationLock
                          ? ethers.utils.formatEther(veNationLock[0])
                          : 0
                      }
                      onChange={(value: any) => {
                        setLockAmount(value)
                        setWantsToIncrease(true)
                      }}
                    />

                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        setLockAmount(
                          veNationLock
                            ? ethers.utils.formatEther(
                                veNationLock[0].add(nationBalance?.value),
                              )
                            : nationBalance?.formatted || '',
                        )
                        setWantsToIncrease(true)
                      }}
                    >
                      Max
                    </button>
                  </div>
                  <p className="-mt-2 mb-4 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-700">
                    <InformationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {requiredBalance == -1 ? '...' : requiredBalance}{' '}
                      $veNATION may be enough now, but $veNATION decays over
                      time.
                    </span>
                  </p>
                  <label className="label">
                    <span className="label-text">
                      Lock expiration date
                      <br />
                      <span className="text-xs">
                        {hasLock && veNationLock
                          ? 'Maximum four years from now.'
                          : 'Minimum one week, maximum four years from now.'}
                      </span>
                    </span>
                  </label>
                  <input
                    type="date"
                    placeholder="Expiration date"
                    className="input input-bordered w-full dark:bg-slate-200"
                    value={lockTime.formatted}
                    min={minMaxLockTime.min}
                    max={minMaxLockTime.max}
                    onChange={(e: any) => {
                      if (e.target.value < minMaxLockTime.min) {
                        return false
                      }
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
                    <p>
                      Your final balance will be approx{' '}
                      {formatPassportSafetyNumber(projectedVeNation)} $veNATION
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
                      approval={approval}
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
        </div>
      </MainCard>
    </>
  )
}
