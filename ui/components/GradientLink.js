import Link from 'next/link'

export default function GradientLink({ text, href }) {
  return (
    <Link href={href}>
      <a className="text-lg font-medium bg-gradient-to-r from-n3blue to-n3green text-transparent bg-clip-text">
        {text} →
      </a>
    </Link>
  )
}
