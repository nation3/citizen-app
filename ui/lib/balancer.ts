import { useState, useEffect, useMemo } from 'react'
import BalancerVault from '../abis/BalancerVault'
import { balancerVault } from './config'
import { Address, useContractRead } from 'wagmi'
import { BigNumber, utils } from 'ethers'

export function useBalancerPool({id}: {id: Address}) {
    const { data: poolData, isLoading } = useContractRead({
        address: balancerVault,
        abi: BalancerVault,
        functionName: 'getPoolTokens',
        args: [id],
    })

    const balances: { nation: BigNumber, weth: BigNumber } = useMemo(() => {
        const nation = poolData?.balances[0] || BigNumber.from(333);
        const weth = poolData?.balances[1] || BigNumber.from(333);
        return { nation, weth }
    }, [poolData])

    const [poolValue, setPoolValue] = useState(0)
    const [nationPrice, setNationPrice] = useState(0)
    const [ethPrice, setEthPrice] = useState(0)

    useEffect(() => {
        async function fetchData() {
            const priceRes = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=nation3,ethereum&vs_currencies=usd'
            )
            const { nation3, ethereum } = await priceRes.json()
            setNationPrice(nation3.usd)
            setEthPrice(ethereum.usd)
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (!isLoading && poolData && nationPrice && ethPrice) {
            const nationBalance = balances.nation
            const wethBalance = balances.weth

            if (nationBalance && wethBalance) {
                const nationValue = nationBalance.mul(Math.round(nationPrice))
                const ethValue = wethBalance.mul(Math.round(ethPrice))
                const totalValue = nationValue.add(ethValue)
                setPoolValue(Number(utils.formatUnits(totalValue)))
            }
        }
    }, [isLoading, poolData, ethPrice, nationPrice, balances.nation, balances.weth])
    return { poolValue, nationPrice, isLoading }
}
