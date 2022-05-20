import React from 'react'
import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { useTimeout } from 'react-use'

export default function ConfettiComponent() {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [isComplete] = useTimeout(5000)

  useEffect(() => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }, [])

  return <Confetti width={width} height={height} recycle={!isComplete()} />
}
