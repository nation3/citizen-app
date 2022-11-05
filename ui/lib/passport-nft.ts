import { useEffect, useState } from 'react'
import { Address, useContractRead, useContractWrite } from 'wagmi'
import { useNft } from 'use-nft'

import PassportNFT from '../abis/Passport'
import PassportIssuer from '../abis/PassportIssuer'
import { nationPassportNFT, nationPassportNFTIssuer } from './config'
import { constants, BigNumber, BigNumberish } from 'ethers'

interface PassportIssuerHooksProps {address: Address | undefined, enabled?: boolean}
interface PassportTokenHooksProps {id: BigNumberish | undefined, enabled?: boolean}

export function useHasPassport({address, enabled}: PassportIssuerHooksProps) {
    const [hasPassport, setHasPassport] = useState(false)
    const { data: passportStatus, isLoading } = usePassportStatus({address, enabled})

    useEffect(() => {
        if (passportStatus == 1) {
            setHasPassport(true)
        }
    }, [passportStatus, isLoading])

    return { hasPassport, isLoading }
}

export function usePassportStatus({address, enabled = true}: PassportIssuerHooksProps) {
    return useContractRead({
        address: nationPassportNFTIssuer,
        abi: PassportIssuer,
        functionName: 'passportStatus',
        args: [address || constants.AddressZero],
        enabled: typeof address !== "undefined" && enabled,
        watch: true
    })
}

export function usePassport({address, enabled = true}: PassportIssuerHooksProps) {
    const { data: id, isLoading: loadingID } = useContractRead({
        address: nationPassportNFTIssuer,
        abi: PassportIssuer,
        functionName: 'passportId',
        enabled: typeof address !== "undefined" && enabled
    })

    console.log(`Passport ID ${id}`)
    const { loading, nft } = useNft(nationPassportNFT, String(id))
    return { id, nft, isLoading: loadingID || loading }
}


export function useClaimPassport() {
    return useContractWrite({
        mode: "recklesslyUnprepared",
        address: nationPassportNFTIssuer,
        abi: PassportIssuer,
        functionName: 'claim',
    })
}

export function usePassportSigner({id}: PassportTokenHooksProps) {
    return useContractRead({
        address: nationPassportNFT,
        abi: PassportNFT,
        functionName: 'signerOf',
        args: [BigNumber.from(id)],
        watch: true,
        enabled: typeof id !== "undefined",
    })
}

interface SetPassportSignerProps extends Omit<PassportTokenHooksProps, 'enabled'> {
    signer: Address
}

export function useSetPassportSigner({id, signer}: SetPassportSignerProps) {
    return useContractWrite({
        mode: "recklesslyUnprepared",
        address: nationPassportNFT,
        abi: PassportNFT,
        functionName: 'setSigner',
        args: [BigNumber.from(id), signer],
    })
}
