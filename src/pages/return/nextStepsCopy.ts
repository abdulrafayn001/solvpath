import type { ReturnResolution } from "@/api"

export const NEXT_STEPS_COPY: Record<ReturnResolution, string> = {
  refund: "Once we receive the returned item(s), we'll refund your original payment method within 5–7 business days.",
  exchange: "Ship the returned item(s) back to us and we'll send your replacement as soon as it's received.",
  store_credit:
    "Once we receive the returned item(s), your store credit will be added to your account within 2–3 business days.",
}
