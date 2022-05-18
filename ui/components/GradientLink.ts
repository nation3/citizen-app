import Link from 'next/link'

export default function GradientLink({
  text,
  href,
  textSize
}: any) {
  if (href.charAt(0) === '/') {
    return (
      // @ts-expect-error ts-migrate(2749) FIXME: 'Link' refers to a value, but is being used as a t... Remove this comment to see the full error message
      <Link href={href}>
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
        <a
          // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
          className={`text-${textSize} font-medium bg-gradient-to-r from-n3blue to-n3green text-transparent bg-clip-text`}
        >
          {text} →
        </a>
      </Link>
    )
  } else {
    return (
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
      <a
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
        className={`text-${textSize} font-medium bg-gradient-to-r from-n3blue to-n3green text-transparent bg-clip-text`}
        href={href}
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'rel'.
        rel="noopener noreferrer"
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'target'.
        target="_blank"
      >
        {text} →
      </a>
    )
  }
}
