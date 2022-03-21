import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import balancerVaultABI from '../abis/BalancerVault.json'

// https://github.com/Uniswap/merkle-distributor/blob/master/scripts/to-kv-input.ts
// https://github.com/Uniswap/interface/blob/3acd993ec0fbc49cdac5df8bdaac84433a5bbe32/src/state/claim/hooks.ts#L104

async function fetchClaim(address) {
  const res = await fetch(
    'https://raw.githubusercontent.com/Uniswap/mrkl-drop-data-chunks/final/chunks/mapping.json'
  )
  const claimMapping = await res.json()
  const sorted = Object.keys(claimMapping).sort((a, b) =>
    a.toLowerCase() < b.toLowerCase() ? -1 : 1
  )

  for (const startingAddress of sorted) {
    const lastAddress = mapping[startingAddress]
    if (startingAddress.toLowerCase() <= formatted.toLowerCase()) {
      if (formatted.toLowerCase() <= lastAddress.toLowerCase()) {
        return startingAddress
      }
    } else {
      return false
    }
  }
  return false
}

async function fetchClaimFile(key) {
  const res = await fetch(
    `https://raw.githubusercontent.com/Uniswap/mrkl-drop-data-chunks/final/chunks/${key}.json`
  )
  return res.json()
}

export async function useUserHasAvailableClaim(account) {
  const userClaimKey = await fetchClaim(account)
  const userClaimFile = await fetchClaimFile(userClaimKey)
  const distributorContract = useMerkleDistributorContract()
  const isClaimedResult = useSingleCallResult(
    distributorContract,
    'isClaimed',
    [userClaimFile?.index]
  )
}
