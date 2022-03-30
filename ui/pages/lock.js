import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { nationToken, veNationToken } from '../lib/config'
import { useNationBalance } from '../lib/nation-token'
import { useAccount } from '../lib/use-wagmi'
import {
  useVeNationBalance,
  useVeNationLockAmount,
  useVeNationLockEnd,
  useVeNationCreateLock,
  useVeNationIncreaseLock,
  useVeNationWithdrawLock,
} from '../lib/ve-token'
import ActionButton from '../components/ActionButton'
import Balance from '../components/Balance'
import Head from '../components/Head'

export default function Liquidity() {
  const [{ data: account }] = useAccount()

  const [{ data: nationBalance, loading: nationBalanceLoading }] =
    useNationBalance(account?.address)

  const [{ data: veNationBalance, loading: veNationBalanceLoading }] =
    useVeNationBalance(account?.address)

  const [{ data: veNationLockAmount, loading: veNationLockAmountLoading }] =
    useVeNationLockAmount(account?.address)

  console.log(veNationLockAmount)

  const [{ data: veNationLockEnd, loading: veNationLockEndLoading }] =
    useVeNationLockEnd(account?.address)

  const [lockAmount, setLockAmount] = useState(0)
  const [lockTime, setLockTime] = useState(new Date())
  const [lockTimestamp, setLockTimestamp] = useState(0)

  useEffect(() => {
    setLockAmount(veNationLockAmount)
    setLockTime(
      veNationLockEnd &&
        new Date(veNationLockEnd * 1000).toISOString().substring(0, 10)
    )

    console.log(veNationLockEnd)
    setLockTimestamp(veNationLockEnd?.formatted)
  }, [
    veNationLockAmount,
    veNationLockAmountLoading,
    veNationLockEnd,
    veNationLockEndLoading,
  ])

  const createLock = useVeNationCreateLock(lockAmount, lockTimestamp)
  const increaseLock = useVeNationIncreaseLock({
    currentAmount: veNationLockAmount,
    newAmount: lockAmount && ethers.utils.parseEther(lockAmount),
    currentTime: veNationLockEnd,
    newTime: lockTimestamp,
  })
  const withdraw = useVeNationWithdrawLock()

  const hasLock = veNationLockEnd && !veNationLockEndLoading

  const loading =
    nationBalanceLoading ||
    veNationBalanceLoading ||
    veNationLockAmountLoading ||
    veNationLockEndLoading

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

                  {hasLock ? (
                    <>
                      <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                        <div className="stat">
                          <div className="stat-title">
                            Your $veNATION balance
                          </div>
                          <div className="stat-value">
                            <Balance
                              loading={loading}
                              balance={
                                veNationBalance &&
                                ethers.utils.formatEther(veNationBalance)
                              }
                              decimals={2}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                        <div className="stat">
                          <div className="stat-title">Your locked $NATION</div>
                          <div className="stat-value">
                            <Balance
                              loading={loading}
                              balance={veNationLockAmount}
                              decimals={2}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                        <div className="stat">
                          <div className="stat-title">
                            Your lock expiration date
                          </div>
                          <div className="stat-value">{lockTime}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                  <div className="card bg-base-100 shadow">
                    <div className="card-body">
                      <div className="form-control">
                        <p className="mb-4">
                          Available to lock:{' '}
                          <Balance
                            loading={nationBalanceLoading}
                            balance={nationBalance?.formatted}
                          />{' '}
                          $NATION
                        </p>
                        {true ? (
                          <>
                            <label class="label">
                              <span class="label-text">Lock amount</span>
                            </label>
                            <div className="input-group mb-4">
                              <input
                                type="number"
                                placeholder="0"
                                className="input input-bordered w-full"
                                value={lockAmount}
                                onChange={(e) => {
                                  setLockAmount(e.target.value)
                                }}
                              />
                              <button
                                className="btn btn-outline"
                                onClick={() =>
                                  setLockAmount(nationBalance?.formatted)
                                }
                              >
                                Max
                              </button>
                            </div>
                            <label class="label">
                              <span class="label-text">
                                Lock expiration date
                              </span>
                            </label>
                            <input
                              type="date"
                              placeholder="Expiration date"
                              className="input input-bordered w-full"
                              value={lockTime}
                              onChange={(e) => {
                                setLockTime(e.target.value)
                                setLockTimestamp(
                                  Date.parse(e.target.value) / 1000
                                )
                              }}
                            />
                            <div className="card-actions mt-4">
                              <ActionButton
                                className="btn btn-primary w-full"
                                action={hasLock ? increaseLock : createLock}
                                approval={{
                                  token: nationToken,
                                  spender: veNationToken,
                                  amountNeeded: lockAmount,
                                  approveText: 'Approve $NATION',
                                }}
                              >
                                Lock
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
