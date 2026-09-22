import { useQuery } from "@tanstack/react-query";

import { getMyTeachingBookings } from "../api/bookings.api";

export function useMyTeachingBookings(enabled = true) {
  return useQuery({
    queryKey: ["my-teaching-bookings"],
    queryFn: getMyTeachingBookings,
    enabled,
  });
}
