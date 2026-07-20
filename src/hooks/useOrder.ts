import { useQuery } from "@tanstack/react-query";

import { fetchOrder } from "@/api";

export function useOrder(orderId: string | undefined) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["order", orderId],
    queryFn: ({ signal }) => fetchOrder(orderId!, signal),
    enabled: Boolean(orderId),
  });

  return { data, isLoading, isError, error, refetch };
}
