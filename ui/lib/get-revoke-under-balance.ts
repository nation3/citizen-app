import { ethers } from 'ethers'
import PassportIssuer from '../abis/PassportIssuer.json'
import { provider } from './connectors'

export async function getRevokeUnderBalance(
  passportIssuerContractAddress: string
) {
  const provider_ = provider()

  const contract = new ethers.Contract(
    passportIssuerContractAddress,
    PassportIssuer.abi,
    provider_
  )

  try {
    console.log(contract)
    const res = await contract.revokeUnderBalance()
    return res
  } catch (err: any) {
    console.log('err101: ', err)
    throw Error(err.message)
  }
}
