export default function TimeRange({
  time,
  min,
  max,
  displaySteps,
  onChange
}: any) {
  const step = (min * 100) / max

  return (
    <>
      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'input'.
      <input
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'type'.
        type="range"
        min={min || 0}
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'max'.
        max={max || 0}
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'value'.
        value={time}
        // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'onChange'. Did you mean 'onchang... Remove this comment to see the full error message
        onChange={(e) => {
          // @ts-expect-error ts-migrate(2552) FIXME: Cannot find name 'onChange'. Did you mean 'onchang... Remove this comment to see the full error message
          onChange(new Date(parseFloat(e.target.value)))
        }}
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'className'.
        className="range range-secondary mt-4"
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'step'.
        step={step || 0}
      />

      // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'div'.
      <div className="w-full flex justify-between text-xs px-2 mb-4">
        // @ts-expect-error ts-migrate(7006) FIXME: Parameter '(Missing)' implicitly has an 'any' type... Remove this comment to see the full error message
        {displaySteps ? (
          <>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'span'.
            <span>-</span>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'span'.
            <span>1 y</span>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'span'.
            <span>2 y</span>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'span'.
            <span>3 y</span>
          </>
        ) : (
          // @ts-expect-error ts-migrate(2365) FIXME: Operator '<' cannot be applied to types 'boolean' ... Remove this comment to see the full error message
          <>
            {' '}
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'span'.
            <span>Now</span>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'span'.
            <span></span>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'span'.
            <span></span>
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'span'.
            <span></span>
          </>
        )}
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'span'.
        <span>4 y</span>
      </div>
    </>
  )
}
