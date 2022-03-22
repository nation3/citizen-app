import { useState, useEffect } from 'react'
import { NftProvider, useNft } from 'use-nft'
import { nationPassportNFT } from '../lib/config'
import ERC721ABI from '../abis/ERC721.json'
import { useContractRead } from './use-wagmi'

export function useHasPassport(address) {
  const [hasPassport, setHasPassport] = useState(false)
  const [{ data, loading, error }] = useContractRead(
    {
      addressOrName: nationPassportNFT,
      contractInterface: ERC721ABI,
    },
    'balanceOf',
    { args: address, skip: !address }
  )
  useEffect(() => {
    setHasPassport(data && data.gt(0))
  }, [loading])
  return [{ data: hasPassport, loading, error }]
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
