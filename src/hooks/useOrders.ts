import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchOrders } from "@/api";
import type { OrderStatus } from "@/api";
import { ORDERS_PAGE_SIZE } from "@/lib/constants";
import { useDebouncedValue } from "./useDebouncedValue";

export interface UseOrdersParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus | "all";
  query?: string;
}

export function useOrders({ page = 1, pageSize = ORDERS_PAGE_SIZE, status = "all", query = "" }: UseOrdersParams = {}) {
  const debouncedQuery = useDebouncedValue(query, 300);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["orders", { page, pageSize, status, query: debouncedQuery }],
    queryFn: ({ signal }) => fetchOrders({ page, pageSize, status, query: debouncedQuery, signal }),
    placeholderData: keepPreviousData,
  });

  return { data, isLoading, isError, error, refetch };
}
