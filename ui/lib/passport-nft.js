import { useState, useEffect } from 'react'
import { NftProvider, useNft } from 'use-nft'
import { nationPassportNFT } from '../lib/config'
import { nationPassportNFTIssuer } from '../lib/config'
// import ERC721ABI from '../abis/ERC721.json'
import PassportABI from '../abis/ERC721.json'
import PassportIssuerABI from '../abis/PassportIssuer.json'
import { useContractRead, useContractWrite } from './use-wagmi'

export function useHasPassport(address) {
  const [hasPassport, setHasPassport] = useState(false)
  const [{ data, loading, error }] = useContractRead(
    {
      addressOrName: nationPassportNFT,
      contractInterface: PassportABI,
    },
    'balanceOf',
    { args: address, skip: !address }
  )
  useEffect(() => {
    setHasPassport(data && data.gt(0))
  }, [loading])
  return [{ data: hasPassport, loading, error }]
}

export function useMintPassport() {
  return useContractWrite(
    {
      addressOrName: nationPassportNFTIssuer,
      contractInterface: PassportIssuerABI,
    },
    'secure'
  )
}

export function usePassport() {
  return useContract({
    addressOrName: nationPassportNFT,
    contractInterface: PassportABI,
  })
}

/*const ethersConfig = {
  provider: getDefaultProvider('mainnet'),
}

function App() {
  return (
    <NftProvider fetcher={["ethers", ethersConfig]}>
      <Nft />
    </NftProvider>
  )
}

function Nft() {
  const { loading, nft } = useNft(
    process.env.NEXT_PUBLIC_BALANCER_PASSPORT_NFT_ADDRESS,
    "90473"
  )

  return (
    <section>
      <h1>{nft.name}</h1>
      <img src={nft.image} alt="" />
      <p>{nft.description}</p>
      <p>Owner: {nft.owner}</p>
      <p>Metadata URL: {nft.metadataUrl}</p>
    </section>
  )
}*/
