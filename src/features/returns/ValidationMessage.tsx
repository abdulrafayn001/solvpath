export function ValidationMessage({ children, id }: { children: string; id?: string }) {
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {children}
    </p>
  )
}
