import { ApiError } from "./mockApi";
import type { AppError } from "./order.types";

const GENERIC_MESSAGE = "Something went wrong. Please try again.";

// Keyed on the real status codes the mock throws: 404 from getOrder, 422 and
// 500 from submitReturn, 503 from listOrders. Anything else falls back to the
// generic message above.
const STATUS_MESSAGES: Record<number, string> = {
  404: "We couldn't find that order.",
  422: "Select at least one item to return.",
  500: "We couldn't submit your return. Please try again.",
  503: "Orders are temporarily unavailable. Please try again in a moment.",
};

export function getErrorMessage(status: number): string {
  return STATUS_MESSAGES[status] ?? GENERIC_MESSAGE;
}

function normalizeError(error: unknown): AppError {
  if (error instanceof ApiError) {
    return { status: error.status, message: getErrorMessage(error.status) };
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    throw error;
  }
  return { status: 0, message: getErrorMessage(0) };
}

/** Runs `fn`, normalizing any thrown error into an AppError — the one place API calls need a try/catch. */
export async function withNormalizedError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw normalizeError(error);
  }
}
