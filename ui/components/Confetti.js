import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { useTimeout } from 'react-use'

export default function ConfettiComponent({ elementRef }) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [isComplete] = useTimeout(5000)

  useEffect(() => {
    setWidth(elementRef?.current.offsetWidth)
    setHeight(elementRef?.current.offsetHeight)
  }, [elementRef])

  return (
    <Confetti width={width} height={height} recycle={!isComplete()} className />
  )
}
