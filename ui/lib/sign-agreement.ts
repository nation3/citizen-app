import { useSignMessage } from './use-wagmi'
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
    { name: 'Agreement', type: 'string' },
  ],
}

const value = {
  Statement: 'By claiming a Nation3 passport and becoming a Nation3 citizen, I hereby agree to the terms outlined here',
  Agreement: ipfsURL
}

const statement = `By claiming a Nation3 passport and becoming a Nation3 citizen, I hereby agree to the terms outlined here ${ipfsURL}`

export function useSignAgreement({onSuccess}: {onSuccess: Function}) {
  /*return useSignTypedData({
    domain,
    types,
    value,
    onSuccess,
  })*/
  return useSignMessage({
    message: statement,
    onSuccess,
  })
}

export async function storeSignature(signature: string, tx: string) {
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