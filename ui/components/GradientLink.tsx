import Link from 'next/link'
import React from 'react'

export default function GradientLink({ text, href, textSize }: any) {
  return (
    <Link
      href={href}
      className={`text-${textSize} font-medium bg-gradient-to-r from-n3blue to-n3green text-transparent bg-clip-text`}
      target={(href?.charAt(0) === '/') ? "_self" : "_blank"}
    >
      {text} →
    </Link>
  )
}
