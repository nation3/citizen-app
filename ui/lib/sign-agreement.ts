import { useSignTypedData } from './use-wagmi'
import networkToId from './networkToId'

const ipfsURL = "https://github.com/nation3/test"

const domain = {
  name: 'Nation3',
  version: '1',
  chainId: networkToId(process.env.NEXT_PUBLIC_CHAIN),
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
}

const types = {
  Message: [
    { name: 'Statement', type: 'string' },
    { name: 'Constitution URL', type: 'string' },
  ],
}

const value = {
  Statement: 'By claiming a Nation3 passport and becoming a Nation3 citizen, I hereby agree to the terms outlined here',
  'Constitution URL': ipfsURL
}

const typedData = {
  types,
  domain,
  message: value,
}

export function useSignAgreement({onSuccess}: {onSuccess: Function}) {
  return useSignTypedData({
    domain,
    types,
    value,
    onSuccess,
  })
}

export function sliceSignTypedParams(signature: string) {
  const r = signature.slice(0, 66)
  const s = '0x' + signature.slice(66, 130)
  const v = Number('0x' + signature.slice(130, 132))
  return { r, s, v }
}

export async function storeSignature(signature: string, tx: string) {
  //console.log(ethers.utils._TypedDataEncoder.hash(domain, types, value))
  const typedData = {
    types,
    domain,
    message: value,
  }
  const response = await fetch('/api/store-signature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({signature, typedData, tx})
  });
  return response.json()
}