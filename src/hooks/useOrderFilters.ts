import { useSearchParams } from "react-router-dom";

import type { OrderStatus } from "@/api";

export type StatusFilterValue = OrderStatus | "all";

const VALID_STATUSES: OrderStatus[] = ["processing", "shipped", "delivered", "cancelled"];

function parseStatus(raw: string | null): StatusFilterValue {
  return raw && (VALID_STATUSES as string[]).includes(raw) ? (raw as OrderStatus) : "all";
}

function parsePage(raw: string | null): number {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/**
 * Owns status/search/page as URL search params (`status`, `q`, `page`) so
 * filters are shareable/bookmarkable and survive a reload. All writes use
 * `replace: true` — filters and pagination click through fast, and treating
 * every keystroke/click as a new history entry would make the back button
 * useless.
 */
export function useOrderFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = parseStatus(searchParams.get("status"));
  const query = searchParams.get("q") ?? "";
  const page = parsePage(searchParams.get("page"));
  const hasActiveFilters = status !== "all" || query !== "";

  const updateParams = (mutate: (params: URLSearchParams) => void) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        mutate(params);
        return params;
      },
      { replace: true }
    );
  };

  const setStatus = (next: StatusFilterValue) =>
    updateParams((params) => {
      if (next === "all") params.delete("status");
      else params.set("status", next);
      params.delete("page");
    });

  const setQuery = (next: string) =>
    updateParams((params) => {
      if (next) params.set("q", next);
      else params.delete("q");
      params.delete("page");
    });

  const setPage = (next: number) =>
    updateParams((params) => {
      if (next > 1) params.set("page", String(next));
      else params.delete("page");
    });

  const clearFilters = () =>
    updateParams((params) => {
      params.delete("status");
      params.delete("q");
      params.delete("page");
    });

  return { status, query, page, hasActiveFilters, setStatus, setQuery, setPage, clearFilters };
}
