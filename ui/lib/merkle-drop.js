import { useState, useMemo } from 'react'
import MerkleDistributor from '../abis/MerkleDistributor.json'
import { nationDropContract1, nationDropContract2 } from './config'
import { useContractRead, useContractWrite } from './use-wagmi'

export function _useClaimsFile() {
  const [data, setData] = useState({ loading: true })
  useMemo(async () => {
    try {
      const res = await fetch(
        `/tweetdrop/${process.env.NEXT_PUBLIC_CHAIN}.json`
      )
      const claims = await res.json()
      setData({ data: claims, loading: false })
    } catch (error) {
      setData({ error, loading: false })
    }
  }, [])
  return [data]
}

const contractParams1 = {
  addressOrName: nationDropContract1,
  contractInterface: MerkleDistributor.abi,
}

const contractParams2 = {
  addressOrName: nationDropContract2,
  contractInterface: MerkleDistributor.abi,
}

export function useIsClaimed(index) {
  return useContractRead(contractParams, 'isClaimed', {
    args: [index],
    watch: true,
    skip: !index,
  })
}

export function getClaimIndex(claims, address) {
  return claims[address]?.index
}

export function useClaimDrop({ index, account, amount, proof }) {
  return useContractWrite(contractParams, 'claim', {
    args: [index, account, amount, proof],
    overrides: {
      gasLimit: 150000,
    },
  })
}
