import Link from 'next/link'

export default function Button({
  text,
  link,
  internal
}: any) {
  if (internal) {
    /*return (
      <a
        className="table p-[1px] bg-gradient-to-r from-n3blue via-n3green to-n3green"
        href={link}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="bg-white px-4 py-3 text-base">{text}</div>
      </a>
    )*/
  } else {
    return (
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'a'.
      <a
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
        className="table p-[1px] bg-gradient-to-r from-n3blue via-n3green to-n3green"
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'href'.
        href={link}
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'rel'.
        rel="noopener noreferrer"
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'target'.
        target="_blank"
      >
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
        <div className="bg-white px-4 py-3 text-base">{text}</div>
      </a>
    )
  }
}
