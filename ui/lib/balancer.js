import { ethers } from 'ethers'
import { useState, useEffect, useMemo } from 'react'
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

  useMemo(async () => {
    const priceRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=nation3,ethereum&vs_currencies=usd'
    )
    const { nation3, ethereum } = await priceRes.json()
    setNationPrice(nation3.usd)
    setEthPrice(ethereum.usd)

    if (process.env.NEXT_PUBLIC_CHAIN === 'local') {
      setNationPrice(3333)
      setEthPrice(3333)
    }
  }, [])

  useEffect(() => {
    if (!loadingPool && nationPrice && ethPrice) {
      const nationBalance = poolData?.balances[0]
      const wethBalance = poolData?.balances[1]

      if (nationBalance && wethBalance) {
        const nationValue = nationBalance.mul(Math.round(nationPrice))
        const ethValue = wethBalance.mul(Math.round(ethPrice))
        const totalValue = nationValue.add(ethValue)
        setPoolValue(ethers.utils.formatEther(totalValue))
      }
    }
    if (process.env.NEXT_PUBLIC_CHAIN === 'local') {
      setPoolValue(transformNumber(2000000, 'bignumber', 0))
    }
  }, [loadingPool, poolData, ethPrice])
  return [{ poolValue, nationPrice, loadingPool }]
}
