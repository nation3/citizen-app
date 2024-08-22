import Link from 'next/link'
import GradientLink from '../components/GradientLink'

export default function HomeCard({
  href,
  icon,
  title,
  children,
  linkText,
}: any) {
  return (
    <Link href={href} passHref>
      <div className="card bg-base-100 shadow-md transition ease-in-out hover:-translate-y-1 cursor-pointer dark:bg-slate-700">
        <div className="card-body items-stretch items-center">
          {icon}
          <h2 className="card-title text-center font-medium dark:text-slate-300 dark:font-bold">
            {title}
          </h2>

          {children}

          <div className='font-medium bg-gradient-to-r from-n3blue to-n3green text-transparent bg-clip-text'>
            {linkText} →
          </div>
        </div>
      </div>
    </Link>
  )
}
