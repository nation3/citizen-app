// Reason for this is that wagmi's useContractWrite doesn't seem to be passing arguments to ethers correctly
import { useState, useMemo } from 'react'
import { useContract, useSigner, useProvider } from 'wagmi'

export function useContractWrite(config, method, argsAndOverrides) {
  const [
    { data: signerData, error: signerError, loadin: signerLoading },
    getSigner,
  ] = useSigner()
  const contract = useContract({
    ...config,
    signerOrProvider: signerData,
  })

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const write = async () => {
    const signer = await getSigner()
    contract.connect(signer)
    try {
      setLoading(true)
      let data
      if (argsAndOverrides) {
        data = await contract[method](...argsAndOverrides.args)
      } else {
        data = await contract[method]()
      }
      setData(data)
      setLoading(false)
    } catch (error) {
      setError(error)
    }
  }
  return [{ data, error, loading }, write]
}
