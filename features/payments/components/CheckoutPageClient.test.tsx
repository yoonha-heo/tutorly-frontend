import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";

const notFound = vi.fn();
const useMyBookings = vi.fn();

vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
}));

vi.mock("@/features/bookings/hooks/useMyBookings", () => ({
  useMyBookings: () => useMyBookings(),
}));

vi.mock("./CheckoutClient", () => ({
  CheckoutClient: ({ booking }: { booking: { id: string } }) => (
    <div>Checkout {booking.id}</div>
  ),
}));

import { CheckoutPageClient } from "./CheckoutPageClient";

beforeEach(() => {
  notFound.mockReset();
  useMyBookings.mockReset();
});

test("keeps the loading state while the new booking is still missing from the cached list", () => {
  useMyBookings.mockReturnValue({
    data: [{ id: "old-booking" }],
    isPending: false,
    isFetching: true,
    isError: false,
  });

  render(<CheckoutPageClient bookingId="new-booking" />);

  expect(screen.getByLabelText("Loading checkout")).toBeInTheDocument();
  expect(notFound).not.toHaveBeenCalled();
});

test("shows the checkout once the refreshed list includes the booking", () => {
  useMyBookings.mockReturnValue({
    data: [{ id: "new-booking" }],
    isPending: false,
    isFetching: false,
    isError: false,
  });

  render(<CheckoutPageClient bookingId="new-booking" />);

  expect(screen.getByText("Checkout new-booking")).toBeInTheDocument();
  expect(notFound).not.toHaveBeenCalled();
});

test("shows not found when the booking is still missing after the list has loaded", () => {
  notFound.mockImplementation(() => {
    throw new Error("NEXT_NOT_FOUND");
  });
  useMyBookings.mockReturnValue({
    data: [{ id: "old-booking" }],
    isPending: false,
    isFetching: false,
    isError: false,
  });

  expect(() => render(<CheckoutPageClient bookingId="new-booking" />)).toThrow(
    "NEXT_NOT_FOUND",
  );
});
