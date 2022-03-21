import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import balancerVaultABI from '../abis/BalancerVault.json'

export function useBalancerPool(id) {
  const [{ data: poolData, loading: loadingPool }] = useContractRead(
    {
      addressOrName: process.env.NEXT_PUBLIC_BALANCER_VAULT_ADDRESS,
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
    const nationBalance = !process.env.NEXT_PUBLIC_DEV
      ? poolData?.balances[0]
      : ethers.utils.parseEther('1000')
    const wethBalance = !process.env.NEXT_PUBLIC_DEV
      ? poolData?.balances[1]
      : ethers.utils.parseEther('100')
    const priceRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    )
    const { ethereum: ethPrice } = await priceRes.json()
    if (nationBalance && wethBalance) {
      const ethValue = wethBalance.mul(Math.round(ethPrice.usd))
      console.log(ethers.utils.formatEther(ethValue))
      const nationValue = ethValue.mul(4)
      const totalValue = ethers.utils.formatEther(ethValue.add(nationValue))
      console.log(totalValue)
      setPoolValue(totalValue / 1000000)
      const bigPrice = nationValue.mul(10 ^ 2).div(nationBalance)
      setNationPrice(bigPrice.toNumber() / (10 ^ 2))
    }
  }, [loadingPool])
  return [{ poolValue, nationPrice, loadingPool }]
}
