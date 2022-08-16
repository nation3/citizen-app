import React from 'react'

export default function TimeRange({
  time,
  min,
  max,
  displaySteps,
  onChange,
}: any) {
  const step = (min * 100) / max

  return (
    <>
      <input
        type="range"
        min={min || 0}
        max={max || 0}
        value={time}
        onChange={(e) => {
          onChange(new Date(parseFloat(e.target.value)))
        }}
        className="range range-secondary mt-4"
        step={step || 0}
      />

      <div className="w-full flex justify-between text-xs px-2 mb-4">
        {displaySteps ? (
          <>
            <span>-</span>

            <span>1 y</span>

            <span>2 y</span>

            <span>3 y</span>
          </>
        ) : (
          <>
            {' '}
            <span>{new Date(min).toISOString().substring(0, 10)}</span>
            <span></span>
            <span></span>
            <span></span>
          </>
        )}

        <span>4 y</span>
      </div>
    </>
  )
}
