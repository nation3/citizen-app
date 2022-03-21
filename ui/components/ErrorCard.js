import { useState } from 'react'

export default function ErrorCard({ error }) {
  const [visible, setVisible] = useState(true)

  setTimeout(() => {
    setVisible(false)
  }, 5000)

  return (
    <>
      {visible ? (
        <div class="card shadow-md bg-error text-primary-content">
          <div class="card-body">
            <h2 class="card-title">{error?.message}</h2>
            <p>{error?.data?.message}</p>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}
