import { ClockIcon } from '@heroicons/react/outline';
import { dateToReadable } from '../lib/date';

interface Props {
  date: Date | undefined;
}

export default function PassportExpiration({date}: Props) {
  return (
    <div className="stat">
      <div className="stat-figure">
        <ClockIcon className="h-8 w-8" />
      </div>
      <div className="stat-title">Passport expiration date</div>
      <div className="stat-value">
        {!!date ? (date > new Date()) ? dateToReadable(date) : 'Expired' : '-'}
      </div>
    </div>
  )
}
