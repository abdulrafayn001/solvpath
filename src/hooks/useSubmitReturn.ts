import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

import { submitReturn } from "@/api";
import type { AppError, ReturnReceipt, ReturnRequest } from "@/api";

// submitReturn takes no AbortSignal, so a fired request can't be cancelled —
// the isPending guard below (on top of disabling the submit button while
// isPending) is what actually stops a double-click from firing two requests.
export function useSubmitReturn() {
  const mutation = useMutation<ReturnReceipt, AppError, ReturnRequest>({
    mutationFn: (request: ReturnRequest) => submitReturn(request),
  });
  const { isPending, mutate: rawMutate, mutateAsync: rawMutateAsync } = mutation;

  const mutate = useCallback(
    (request: ReturnRequest, options?: Parameters<typeof rawMutate>[1]) => {
      if (isPending) return;
      rawMutate(request, options);
    },
    [isPending, rawMutate]
  );

  const mutateAsync = useCallback(
    (request: ReturnRequest) => {
      if (isPending) return Promise.reject(new Error("A return submission is already in progress."));
      return rawMutateAsync(request);
    },
    [isPending, rawMutateAsync]
  );

  return {
    mutate,
    mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
