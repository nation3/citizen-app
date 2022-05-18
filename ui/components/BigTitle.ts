export default function BigTitle({
  text,
  gradientText
}: any) {
  return (
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
    <div>
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h1'.
      <h1 className="text-4xl tracking-loose text-gray-900 sm:text-5xl md:text-6xl font-display md:leading-tight">
        {text}
      </h1>
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'h1'.
      <h1 className="text-4xl tracking-loose sm:text-5xl md:text-6xl bg-gradient-to-r from-n3blue via-n3green to-n3green text-transparent bg-clip-text font-display mt-1 md:leading-tight">
        {gradientText}
      </h1>
    </div>
  )
}
