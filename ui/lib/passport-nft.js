import { getDefaultProvider } from 'ethers'
import { NftProvider, useNft } from 'use-nft'
import { nationPassportNFT } from '../lib/config'
import { useContractRead } from './use-wagmi'

export function useHasPassport(address) {
  const [{ data, loading }] = useContractRead(
    {
      addressOrName: nationPassportNFT,
      contractInterface: ensRegistryABI,
    },
    'balanceOf',
    { args: address }
  )

  return [{ data, loading }]
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
