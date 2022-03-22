import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import balancerVaultABI from '../abis/BalancerVault.json'
import { balancerVault } from './config'
import { useContractRead } from './use-wagmi'

export function useBalancerPool(id) {
  const [{ data: poolData, loading: loadingPool }] = useContractRead(
    {
      addressOrName: balancerVault,
      contractInterface: balancerVaultABI,
    },
    'getPoolTokens',
    {
      args: id,
    }
  )

  const [poolValue, setPoolValue] = useState(0)
  const [nationPrice, setNationPrice] = useState(0)

  useEffect(async () => {
    const nationBalance = poolData?.balances[0]
    const wethBalance = poolData?.balances[1]
    const priceRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    )
    const { ethereum: ethPrice } = await priceRes.json()

    if (nationBalance && wethBalance) {
      const ethValue = wethBalance.mul(Math.round(ethPrice.usd))
      const nationValue = ethValue.mul(4)
      const totalValue = ethValue.add(nationValue)
      setPoolValue(totalValue.toNumber() / 1000000)
      const bigPrice = nationValue.mul(10 ^ 2).div(nationBalance)
      //setNationPrice(bigPrice.toNumber() / (10 ^ 2))
      setNationPrice(
        nationValue.toString() / ethers.utils.formatEther(nationBalance)
      )
    }
  }, [loadingPool])
  return [{ poolValue, nationPrice, loadingPool }]
}
