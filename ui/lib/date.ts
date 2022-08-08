
export const dateToReadable = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;
  return date.toISOString().substring(0, 10)
}
