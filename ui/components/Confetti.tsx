// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  return <Confetti width={width} height={height} recycle={!isComplete()} />
}
