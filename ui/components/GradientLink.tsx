import Link from 'next/link'
import React from 'react'

export default function GradientLink({ text, href, textSize }: any) {
  if (href?.charAt(0) === '/') {
    return (
      <Link href={href}>
        <a
          className={`text-${textSize} font-medium bg-gradient-to-r from-n3blue to-n3green text-transparent bg-clip-text`}
        >
          {text} →
        </a>
      </Link>
    )
  } else {
    return (
      <a
        className={`text-${textSize} font-medium bg-gradient-to-r from-n3blue to-n3green text-transparent bg-clip-text`}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {text} →
      </a>
    )
  }
}
