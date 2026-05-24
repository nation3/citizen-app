const MIN_PASSPORT_BUFFER = 0.01
const PASSPORT_BUFFER_RATIO = 0.005

export function getBufferedPassportBalance(requiredBalance: number) {
  if (requiredBalance <= 0) return 0

  const buffer = Math.max(
    requiredBalance * PASSPORT_BUFFER_RATIO,
    MIN_PASSPORT_BUFFER,
  )
  return Math.ceil(Number(((requiredBalance + buffer) * 100).toFixed(8))) / 100
}

export function formatPassportBalance(balance: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(balance) ? 0 : 2,
  }).format(balance)
}
