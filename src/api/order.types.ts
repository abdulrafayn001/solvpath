export type {
  ListParams,
  Order,
  OrderItem,
  OrderStatus,
  Page,
  ReturnReceipt,
  ReturnRequest,
  ReturnResolution,
} from "./mockApi";
export { ApiError } from "./mockApi";

/** Normalized app-level error shape — what the rest of the app catches, regardless of source. */
export interface AppError {
  status: number;
  message: string;
}
