import { useState, useEffect } from 'react'
import BalancerVault from '../abis/BalancerVault.json'
import { balancerVault } from './config'
import { NumberType, transformNumber } from './numbers'
import { useContractRead } from './use-wagmi'

export function useBalancerPool(id: any) {
  const { data: poolData, isLoading } = useContractRead(
    {
      addressOrName: balancerVault,
      contractInterface: BalancerVault.abi,
    },
    'getPoolTokens',
    {
      args: id,
    },
    process.env.NEXT_PUBLIC_CHAIN === 'mainnet'
  )

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
      let nationBalance
      let wethBalance
      if (process.env.NEXT_PUBLIC_CHAIN === 'mainnet') {
        const balances = poolData[1]
        nationBalance = balances[0]
        wethBalance = balances[1]
      } else {
        nationBalance = transformNumber(333, NumberType.bignumber)
        wethBalance = transformNumber(333, NumberType.bignumber)
      }

      if (nationBalance && wethBalance) {
        const nationValue = nationBalance.mul(Math.round(nationPrice))
        const ethValue = wethBalance.mul(Math.round(ethPrice))
        const totalValue = nationValue.add(ethValue)
        setPoolValue(totalValue)
      }
    }
  }, [isLoading, poolData, ethPrice, nationPrice])
  return { poolValue, nationPrice, isLoading }
}
