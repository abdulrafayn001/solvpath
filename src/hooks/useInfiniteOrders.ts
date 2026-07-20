import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchOrders } from "@/api";
import type { OrderStatus } from "@/api";
import { ORDERS_PAGE_SIZE } from "@/lib/constants";
import { useDebouncedValue } from "./useDebouncedValue";

export interface UseInfiniteOrdersParams {
  pageSize?: number;
  status?: OrderStatus | "all";
  query?: string;
}

export function useInfiniteOrders({
  pageSize = ORDERS_PAGE_SIZE,
  status = "all",
  query = "",
}: UseInfiniteOrdersParams = {}) {
  const debouncedQuery = useDebouncedValue(query, 300);

  return useInfiniteQuery({
    queryKey: ["orders", "infinite", { pageSize, status, query: debouncedQuery }],
    queryFn: ({ pageParam, signal }) =>
      fetchOrders({ page: pageParam, pageSize, status, query: debouncedQuery, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const loadedCount = lastPage.page * lastPage.pageSize;
      return loadedCount < lastPage.total ? lastPage.page + 1 : undefined;
    },
  });
}
