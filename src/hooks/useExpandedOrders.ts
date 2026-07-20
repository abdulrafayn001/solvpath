import { useState } from "react"

export function useExpandedOrders() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpanded = (orderId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(orderId)) {
        next.delete(orderId)
      } else {
        next.add(orderId)
      }
      return next
    })
  }

  const isExpanded = (orderId: string) => expandedIds.has(orderId)

  return { isExpanded, toggleExpanded }
}
