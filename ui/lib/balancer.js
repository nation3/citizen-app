import { ethers } from 'ethers'
import { useState, useEffect, useMemo } from 'react'
import BalancerVault from '../abis/BalancerVault.json'
import { balancerVault } from './config'
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
    /*const priceRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    )
    const { ethereum } = await priceRes.json()
    setEthPrice(ethereum.usd)*/

    setEthPrice(3300)
  }, [])

  useEffect(async () => {
    if (!loadingPool && ethPrice) {
      const nationBalance = poolData?.balances[0]
      const wethBalance = poolData?.balances[1]

      if (nationBalance && wethBalance) {
        const ethValue = wethBalance.mul(Math.round(ethPrice))
        const nationValue = ethValue.mul(4)
        const totalValue = ethValue.add(nationValue)
        setPoolValue(ethers.utils.formatEther(totalValue))
        const nationPrice = nationValue.div(nationBalance)
        setNationPrice(nationPrice.toString())
      }
    }
  }, [loadingPool])
  return [{ poolValue, nationPrice, loadingPool }]
}
