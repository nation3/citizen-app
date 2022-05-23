import { useSignMessage } from './use-wagmi'

const statement = `${process.env.NEXT_PUBLIC_AGREEMENT_STATEMENT} ${process.env.NEXT_PUBLIC_AGREEMENT_URL}`
console.log(statement)
export function useSignAgreement({onSuccess}: {onSuccess: Function}) {
  return useSignMessage({
    message: statement,
    onSuccess,
  })
}

export async function storeSignature(signature: string, tx: string) {
  console.log(signature)
  const response = await fetch('/api/store-signature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({signature, tx})
  });
  return response.json()
}