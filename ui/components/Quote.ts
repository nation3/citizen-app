export default function Quote({
  children,
  author
}: any) {
  return (
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
    <div className="pl-3 border-l border-n3blue mb-4">
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'p'.
      <p>{children}</p> <p className="text-n3blue text-sm mt-2">{author}</p>
    </div>
  )
}
