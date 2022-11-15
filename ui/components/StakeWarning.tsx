import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export const StakeWarning = () => {
  return (
    <div className="mb-4 text-white bg-red-400 alert">
      <div>
        <ExclamationTriangleIcon className="w-12 h-12" />
        <div className="flex flex-col gap-0.5 text-xs text-justify">
          <span>
            Our liquidity rewards programme has concluded. Please{' '}
            <span className="font-semibold">
              withdraw your liquidity tokens
            </span>{' '}
            as they are no longer accruing rewards
          </span>
        </div>
      </div>
    </div>
  )
}
