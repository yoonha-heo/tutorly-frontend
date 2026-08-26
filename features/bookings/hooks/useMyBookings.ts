import { useQuery } from "@tanstack/react-query";

import { getMyBookings } from "../api/bookings.api";

interface UseMyBookingsOptions {
  refetchInterval?: number | false;
}

export function useMyBookings({ refetchInterval }: UseMyBookingsOptions = {}) {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
    refetchInterval,
  });
}
