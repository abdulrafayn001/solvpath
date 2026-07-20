import { getOrder, listOrders, submitReturn } from "./mockApi";
import type { ListParams, Order, Page, ReturnReceipt, ReturnRequest } from "./order.types";

export function fetchOrders(params: ListParams = {}): Promise<Page<Order>> {
  return listOrders(params);
}

export function fetchOrder(orderId: string, signal?: AbortSignal): Promise<Order> {
  return getOrder(orderId, signal);
}

export function createReturn(request: ReturnRequest): Promise<ReturnReceipt> {
  return submitReturn(request);
}
