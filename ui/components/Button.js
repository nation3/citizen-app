import Link from 'next/link'

export default function Button({ text, link, internal }) {
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
      <a
        className="table p-[1px] bg-gradient-to-r from-n3blue via-n3green to-n3green"
        href={link}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="bg-white px-4 py-3 text-base">{text}</div>
      </a>
    )
  }
}
