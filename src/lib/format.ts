const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export function formatCents(cents: number) {
  return currencyFormatter.format(cents / 100)
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export function formatOrderDate(isoDate: string) {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00`))
}
