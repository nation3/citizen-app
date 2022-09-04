import { ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NFTStorage, Blob } from 'nft.storage'
import { nationPassportNFTIssuer } from '../../lib/config'
import { provider } from '../../lib/connectors'
import { domain, types, value } from '../../lib/sign-agreement'

const client = new NFTStorage({
  token: process.env.NFTSTORAGE_KEY || '',
})

export default async function storeSignature(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const prov = provider()

    const sender = ethers.utils.verifyTypedData(
      domain,
      types,
      value,
      req.body.signature
    )
    const { from, to, confirmations } = await prov.getTransaction(req.body.tx)
    // To prevent spam attacks: Check that the sender of the transaction is the same as the uploader,
    // the receiver is the passport issuer and the transaction is not very old
    if (
      sender === from &&
      to === nationPassportNFTIssuer &&
      confirmations < 14 * 60
    ) {
      const data = new Blob([
        JSON.stringify({ v: 1, sig: req.body.signature, tx: req.body.tx }),
      ])
      const cid = await client.storeBlob(data)
      res.status(200).json({ cid })
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: `Storing your signature failed. This is your signature: ${req.body.signature}`,
    })
  }
}
