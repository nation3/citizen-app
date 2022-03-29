import { ethers } from 'ethers'
import { useState, useMemo } from 'react'
import { abi as MerkleDistributorABI } from '../abis/MerkleDistributor.json'
import { nationDropContract } from './config'
import { useContractRead, useContractWrite } from './use-wagmi'

// import { nationDropContractABI } from './config'

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

export function useClaimsFile() {
  const [data, setData] = useState({ loading: true })
  useMemo(async () => {
    try {
      const res = await fetch('/merkle-test/claims.json')
      const claims = await res.json()
      setData({ data: claims, loading: false })
    } catch (error) {
      setData({ error, loading: false })
    }
  }, [])
  return [data]
}

export function useIsClaimed(index) {
  return useContractRead(
    {
      addressOrName: nationDropContract,
      contractInterface: MerkleDistributorABI,
    },
    'isClaimed',
    {
      args: [index],
      watch: true,
      skip: !index,
    }
  )
}

export function getClaimIndex(claims, address) {
  return claims[address]?.index
}

export function useClaimDrop({ index, account, amount, proof }) {
  return useContractWrite(
    {
      addressOrName: nationDropContract,
      contractInterface: MerkleDistributorABI,
    },
    'claim',
    {
      args: [index, account, amount, proof],
      skip: !index || !account | !amount || !proof,
    }
  )
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
