export default function Quote({ children, author }) {
  return (
    <div className="pl-3 border-l border-n3blue mb-4">
      <p>{children}</p> <p className="text-n3blue text-sm mt-2">{author}</p>
    </div>
  )
}
