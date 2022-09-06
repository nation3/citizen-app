import React from 'react'
import { isFixedDecimalsNumber } from '../lib/numbers'

export default function EthersInput({ onChange, ...props}: any) {
    const onInputChange = (e: any) => {
        const value = e.target.value
        const isValid = isFixedDecimalsNumber(value)
        if (isValid) {
            onChange(value)
        }
    }

    return <input onChange={onInputChange} {...props} />
}
