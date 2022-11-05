import { utils, BigNumber, BigNumberish } from 'ethers'
import { useState, useEffect, useMemo } from 'react'
import { lpRewardsContract, balancerLPToken } from '../lib/config'
import LiquidityRewardsDistributor from '../abis/BoostedLiquidityDistributor'
import ERC20 from '../abis/ERC20'
import { NumberType, transformNumber } from './numbers'
import {
    Address,
    useBalance,
    // useStaticCall,
    useContractRead,
    useContractWrite,
} from 'wagmi'
import { useStaticCall } from './static-call'

export function useLiquidityRewards({ nationPrice, poolValue, address }: any) {
    const { data: totalRewardsRaw, isLoading: totalRewardsLoading } =
        useContractRead({
            address: lpRewardsContract,
            abi: LiquidityRewardsDistributor,
            functionName: 'totalRewards'
        })
    const months = 6

    const totalRewards = useMemo(() => BigNumber.from(totalRewardsRaw), [totalRewardsRaw])

    const { data: unclaimedRewards, loading: unclaimedRewardsLoading } =
        useStaticCall({
            address: lpRewardsContract,
            abi: LiquidityRewardsDistributor,
            methodName: 'claimRewards',
            defaultData: transformNumber(0, NumberType.bignumber),
            throwOnRevert: false, // assumes a reverted transaction means no claimable rewards
            skip: !address,
        })

    const { data: userDeposit, isLoading: userDepositLoading } = useContractRead({
        address: lpRewardsContract,
        abi: LiquidityRewardsDistributor,
        functionName: 'userDeposit',
        args: [address],
        watch: true,
        enabled: Boolean(address),
    })

    const { data: totalDeposit, isLoading: totalDepositLoading } =
        useContractRead({
            address: lpRewardsContract,
            abi: LiquidityRewardsDistributor,
            functionName: 'totalDeposit'
        })

    const { data: lpTokensSupply, isLoading: lpTokensSupplyLoading } =
        useContractRead({
            address: balancerLPToken,
            abi: ERC20,
            functionName: 'totalSupply'
        })

    const { data: userBalance, isLoading: userBalanceLoading } = useContractRead({
        address: lpRewardsContract,
        abi: LiquidityRewardsDistributor,
        functionName: 'userBalance',
        args: [address],
        watch: true,
        enabled: Boolean(address),
    })

    const [liquidityRewardsAPY, setLiquidityRewardsAPY] = useState<BigNumber>(
        transformNumber(0, NumberType.bignumber) as BigNumber
    )

    useEffect(() => {
        if (totalRewards && poolValue && totalDeposit && lpTokensSupply) {
            setLiquidityRewardsAPY(
                totalRewards
                    .mul(transformNumber(12 / months, NumberType.bignumber))
                    .mul(transformNumber(nationPrice, NumberType.bignumber, 2))
                    .div(poolValue.mul(totalDeposit).div(lpTokensSupply))
            )
        }
    }, [
        poolValue,
        totalDeposit,
        lpTokensSupply,
        nationPrice,
        totalRewards,
        totalRewardsLoading,
        totalDepositLoading,
        lpTokensSupplyLoading,
    ])

    return {
        liquidityRewardsAPY,
        unclaimedRewards,
        userDeposit,
        totalDeposit,
        userBalance,
        loading:
            totalRewardsLoading ||
            unclaimedRewardsLoading ||
            userDepositLoading ||
            totalDepositLoading ||
            userBalanceLoading,
    }
}

export function usePoolTokenBalance({address}: {address: Address | undefined}) {
    return useBalance({
        addressOrName: address,
        token: balancerLPToken,
        watch: true,
    })
}

interface VeNationBoostProps {
    userDeposit: BigNumberish | undefined,
    totalDeposit: BigNumberish | undefined,
    userVeNation: BigNumberish | undefined,
    totalVeNation: BigNumberish | undefined,
    userBalance: BigNumberish | undefined
}

// userDeposit = amount of LP tokens staked by user
// totalDeposit = amount of LP tokens in rewards contract
// userVotingPower = veNationBalance
// totalVotingPower = veNATION supply
export function useVeNationBoost({
    userDeposit,
    totalDeposit,
    userVeNation,
    totalVeNation,
    userBalance,
}: VeNationBoostProps) {
    const [boost, setBoost] = useState<{ currentBoost?: BigNumber, potentialBoost?: BigNumber, canBoost: boolean }>({
        canBoost: false,
    })
    useEffect(() => {
        if (
            userDeposit &&
            totalDeposit &&
            userVeNation &&
            totalVeNation &&
            userBalance
        ) {
            const n = {
                userDeposit: parseFloat(
                    transformNumber(userDeposit, NumberType.string) as string
                ),
                totalDeposit: parseFloat(
                    transformNumber(totalDeposit, NumberType.string) as string
                ),
                userVeNation: parseFloat(
                    transformNumber(userVeNation, NumberType.string) as string
                ),
                totalVeNation: parseFloat(
                    transformNumber(totalVeNation, NumberType.string) as string
                ),
                userBalance: parseFloat(
                    transformNumber(userBalance, NumberType.string) as string
                ),
            }

            const baseBalance = n.userDeposit * 0.4

            let boostedBalance =
                baseBalance +
                ((n.totalDeposit * n.userVeNation) / n.totalVeNation) * (60 / 100)

            boostedBalance = Math.min(boostedBalance, n.userDeposit)

            const potentialBoost = boostedBalance / baseBalance

            boostedBalance = Math.min(boostedBalance, n.userDeposit)

            const currentBoost = n.userBalance / baseBalance

            setBoost({
                currentBoost: BigNumber.from(Math.max(currentBoost, 1)),
                potentialBoost: BigNumber.from(potentialBoost),
                canBoost:
                    Math.trunc(potentialBoost * 10) > Math.trunc(currentBoost * 10),
            })
        }
    }, [userDeposit, totalDeposit, userVeNation, totalVeNation, userBalance])

    return boost
}

export function useBoostedAPY({ defaultAPY, boostMultiplier }: { defaultAPY: BigNumber | undefined, boostMultiplier: BigNumber | undefined }) {
    const [apy, setAPY] = useState<number>(
        Number(utils.formatUnits(defaultAPY || 0))
    )
    useEffect(() => {
        if (defaultAPY?.gt(0) && boostMultiplier?.gt(0)) {
            setAPY(Number(utils.formatUnits(defaultAPY.mul(boostMultiplier))))
        }
    }, [defaultAPY, boostMultiplier])
    return apy
}

// Using Wagmi's contractWrite directly, getting a "no signer connected" error otherwise
export function useClaimRewards() {
    return useContractWrite({
        mode: "recklesslyUnprepared",
        address: lpRewardsContract,
        abi: LiquidityRewardsDistributor,
        functionName: 'claimRewards',
        overrides: { gasLimit: BigNumber.from(300000) },
    })
}

export function useDeposit(amount: BigNumberish) {
    return useContractWrite({
        mode: "recklesslyUnprepared",
        address: lpRewardsContract,
        abi: LiquidityRewardsDistributor,
        functionName: 'deposit',
        args: [BigNumber.from(amount)],
        overrides: { gasLimit: BigNumber.from(300000) },
    })
}

export function useWithdraw(amount: BigNumberish) {
    return useContractWrite({
        mode: "recklesslyUnprepared",
        address: lpRewardsContract,
        abi: LiquidityRewardsDistributor,
        functionName: 'withdraw',
        args: [BigNumber.from(amount)],
        overrides: { gasLimit: BigNumber.from(300000) },
    })
}

export function useWithdrawAndClaim() {
    return useContractWrite({
        mode: "recklesslyUnprepared",
        address: lpRewardsContract,
        abi: LiquidityRewardsDistributor,
        functionName: 'withdrawAndClaim',
        overrides: { gasLimit: BigNumber.from(300000) },
    })
}
