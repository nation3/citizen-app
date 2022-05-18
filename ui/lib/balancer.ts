// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { useState, useEffect } from 'react'
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../abis/BalancerVault.json'. C... Remove this comment to see the full error message
import BalancerVault from '../abis/BalancerVault.json'
import { balancerVault } from './config'
import { transformNumber } from './numbers'
import { useContractRead } from './use-wagmi'

export function useBalancerPool(id: any) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
  const { data: poolData, isLoading } = useContractRead(
    {
      addressOrName: balancerVault,
      contractInterface: BalancerVault.abi,
    },
    'getPoolTokens',
    {
      args: id,
    }
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
        nationBalance = transformNumber(333, 'bignumber', 18)
        wethBalance = transformNumber(333, 'bignumber', 18)
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
