import { useParams } from "react-router-dom"

export function OrderDetailPage() {
  const { orderId } = useParams()
  return (
    <div className="p-6">
      <h1 className="text-lg font-medium">Order {orderId}</h1>
    </div>
  )
}
