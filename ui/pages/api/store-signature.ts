import type { NextApiRequest, NextApiResponse } from 'next'
import { provider } from '../../lib/connectors'
import { NFTStorage, Blob } from 'nft.storage'
import { ethers } from 'ethers'
import networkToId from '../../lib/networkToId'

const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFTSTORAGE_KEY })

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const prov = provider(networkToId(process.env.NEXT_PUBLIC_CHAIN))
    const sender = ethers.utils.verifyTypedData(req.body.typedData.domain, req.body.typedData.types, req.body.typedData.message, req.body.signature)
    const { from, confirmations } = await prov.getTransaction(req.body.tx)
    // Check that the sender of the transaction is the same as the uploader,
    // and check that the transaction is not very old to prevent spam attacks
    if (sender === from && confirmations < 14*60) {
      const data = new Blob([JSON.stringify({sig: req.body.signature, v: 1})])
      await client.storeBlob(data)
      res.status(200)
    }
  } catch (e) {
    console.error(e)
    res.status(500)
  }
}