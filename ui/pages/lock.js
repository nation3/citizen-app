import { useState } from 'react'
import { nationToken } from '../lib/config'
import { useNationBalance } from '../lib/nation-token'
import { useAccount } from '../lib/use-wagmi'
import {
  useVeNationBalance,
  useVeNationLockAmount,
  useVeNationLockEnd,
  useVeNationCreateLock,
  useVeNationIncreaseLockAmount,
  useVeNationIncreaseLockTime,
  useVeNationWithdrawLock,
} from '../lib/ve-token'
import ActionButton from '../components/ActionButton'
import Head from '../components/Head'
import LoadingBalance from '../components/LoadingBalance'

export default function Liquidity() {
  const [{ data: account }] = useAccount()

  const [{ data: nationBalance, loading: nationBalanceLoading }] =
    useNationBalance(account?.address)

  const [{ data: veNationBalance, loading: veNationBalanceLoading }] =
    useVeNationBalance(account?.address)

  const [{ data: veNationLockAmount, loading: veNationLockAmountLoading }] =
    useVeNationLockAmount(account?.address)

  const [{ data: veNationLockEnd, loading: veNationLockEndLoading }] =
    useVeNationLockEnd(account?.address)

  const createLock = useVeNationCreateLock(account?.address)
  const increaseLockAmount = useVeNationIncreaseLockAmount(account?.address)
  const increaseLockTime = useVeNationIncreaseLockTime(account?.address)
  const withdraw = useVeNationWithdrawLock(account?.address)

  const [lockValue, setLockValue] = useState(0)

  return (
    <>
      <Head title="$veNATION" />
      <div className="hero bg-gradient-to-r from-n3blue-100 to-n3green-100 flex-auto overflow-auto">
        <div className="hero-content">
          <div className="max-w-md">
            <div className="card w-80 md:w-96 bg-base-100 shadow-xl">
              <div className="card-body items-stretch items-center">
                <h2 className="card-title text-center">
                  Lock $NATION to get $veNATION
                </h2>
                <p>Learn about $veNATION.</p>

                <div className="stats stats-vertical lg:stats-horizontal shadow my-4">
                  <div className="stat">
                    <div className="stat-title">Your $veNATION balance</div>
                    <div className="stat-value">
                      <LoadingBalance
                        balanceLoading={loading}
                        balance={veNationBalance}
                        suffix="%"
                        decimals={0}
                      />
                    </div>
                  </div>
                </div>
                <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                  <div className="stat">
                    <div className="stat-title">Your locked $NATION</div>
                    <div className="stat-value">
                      <LoadingBalance
                        balanceLoading={loading}
                        balance={veNationBalance}
                        suffix="%"
                        decimals={0}
                      />
                    </div>
                  </div>
                </div>
                <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                  <div className="stat">
                    <div className="stat-title">Your lock expiration date</div>
                    <div className="stat-value">02-04-2024</div>
                  </div>
                </div>
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <div className="form-control">
                      <p className="mb-4">
                        Available to lock:{' '}
                        <LoadingBalance
                          balanceLoading={nationBalanceLoading}
                          balance={nationBalance?.formatted}
                        />{' '}
                        $NATION
                      </p>
                      {!lockExpired ? (
                        <>
                          <label class="label">
                            <span class="label-text">Lock amount</span>
                          </label>
                          <div className="input-group mb-4">
                            <input
                              type="number"
                              placeholder="0"
                              className="input input-bordered w-full"
                              value={lockValue}
                              onChange={(e) => {
                                setLockValue(e.target.value)
                              }}
                            />
                            <button
                              className="btn btn-outline"
                              onClick={() =>
                                setLockValue(nationBalance?.formatted)
                              }
                            >
                              Max
                            </button>
                          </div>
                          <label class="label">
                            <span class="label-text">Lock expiration date</span>
                          </label>
                          <input
                            type="date"
                            placeholder="Expiration date"
                            className="input input-bordered w-full"
                          />
                          <div className="card-actions mt-4">
                            <ActionButton
                              className="btn btn-primary w-full"
                              action={lock}
                              approval={{
                                token: nationToken,
                                spender: nationToken,
                                amountNeeded: 100,
                                approveText: 'Approve $NATION',
                              }}
                            >
                              Deposit
                            </ActionButton>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>
                            Your previous lock has expired, you need to withdraw{' '}
                          </p>
                          <div className="card-actions mt-4">
                            <ActionButton
                              className="btn btn-primary w-full"
                              action={lock}
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
      </div>
    </>
  )
}
