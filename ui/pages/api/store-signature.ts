import type { NextApiRequest, NextApiResponse } from 'next'
import { provider } from '../../lib/connectors'
import { NFTStorage, Blob } from 'nft.storage'
import { ethers } from 'ethers'
import networkToId from '../../lib/networkToId'
import { nationPassportNFTIssuer } from '../../lib/config'

const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFTSTORAGE_KEY })

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const prov = provider(networkToId(process.env.NEXT_PUBLIC_CHAIN))
    const sender = ethers.utils.verifyTypedData(req.body.typedData.domain, req.body.typedData.types, req.body.typedData.message, req.body.signature)
    const { from, to, confirmations } = await prov.getTransaction(req.body.tx)
    // To prevent spam attacks: Check that the sender of the transaction is the same as the uploader,
    // the receiver is the passport issuer and the transaction is not very old
    if (sender === from && to === nationPassportNFTIssuer && confirmations < 14*60) {
      const data = new Blob([JSON.stringify({v: 1, sig: req.body.signature, tx: req.body.tx})])
      const cid = await client.storeBlob(data)
      res.status(200).json({ cid })
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: true })
  }
}