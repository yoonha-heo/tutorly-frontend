import { useQuery } from "@tanstack/react-query";

import { getMyBookings } from "../api/bookings.api";

export function useMyBookings() {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });
}
