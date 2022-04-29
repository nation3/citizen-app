import { useState, useEffect } from 'react'
import BalancerVault from '../abis/BalancerVault.json'
import { balancerVault } from './config'
import { transformNumber } from './numbers'
import { useContractRead } from './use-wagmi'

export function useBalancerPool(id) {
  const [{ data: poolData, loading: loadingPool }] = useContractRead(
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

  useEffect(async () => {
    const priceRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=nation3,ethereum&vs_currencies=usd'
    )
    const { nation3, ethereum } = await priceRes.json()
    setNationPrice(nation3.usd)
    setEthPrice(ethereum.usd)
  }, [])

  useEffect(() => {
    if (!loadingPool && nationPrice && ethPrice) {
      let nationBalance
      let wethBalance
      if (process.env.NEXT_PUBLIC_CHAIN === 'mainnet') {
        nationBalance = poolData?.balances[0]
        wethBalance = poolData?.balances[1]
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
  }, [loadingPool, poolData, ethPrice, nationPrice])
  return [{ poolValue, nationPrice, loadingPool }]
}
