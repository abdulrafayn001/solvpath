import { createReturn } from "./order.service";
import type { ReturnReceipt, ReturnRequest } from "./order.types";

/** POST /returns — thin, returns-domain wrapper around order.service's submitReturn normalization. */
export function submitReturn(request: ReturnRequest): Promise<ReturnReceipt> {
  return createReturn(request);
}
