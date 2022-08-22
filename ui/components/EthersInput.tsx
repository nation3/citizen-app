import React from 'react'

export default function EthersInput({ onChange, ...props}: any) {
    const onInputChange = (e: any) => {
        const value = e.target.value
        const isValid = value.toString().match(/^(\d*\.{0,1}\d{0,18}$)/)
        if (isValid) {
            onChange(value)
        }
    }

    return <input onChange={onInputChange} {...props} />
}
