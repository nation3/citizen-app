export default function TimeRange({ time, min, max, onChange }) {
  const step = (min * 100) / max

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={time}
        onChange={(e) => {
          onChange(new Date(parseFloat(e.target.value)))
        }}
        className="range range-secondary mt-4"
        step={step}
      />

      <div className="w-full flex justify-between text-xs px-2 mb-4">
        <span>-</span>
        <span>1 y</span>
        <span>2 y</span>
        <span>3 y</span>
        <span>4 y</span>
      </div>
    </>
  )
}
