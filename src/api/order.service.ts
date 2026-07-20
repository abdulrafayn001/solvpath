import { withNormalizedError } from "./errors";
import { getOrder, listOrders, submitReturn } from "./mockApi";
import type { ListParams, Order, Page, ReturnReceipt, ReturnRequest } from "./order.types";

export function fetchOrders(params: ListParams = {}): Promise<Page<Order>> {
  return withNormalizedError(() => listOrders(params));
}

export function fetchOrder(orderId: string, signal?: AbortSignal): Promise<Order> {
  return withNormalizedError(() => getOrder(orderId, signal));
}

export function createReturn(request: ReturnRequest): Promise<ReturnReceipt> {
  return withNormalizedError(() => submitReturn(request));
}
