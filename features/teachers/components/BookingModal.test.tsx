import { useState } from "react";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { beforeEach, expect, test, vi } from "vitest";

import type { Teacher } from "@/features/teachers/types/teachers";
import { formatAvailabilityTime } from "@/utils/localDateTime";
import { server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/renderWithProviders";

import { BookingModal } from "./BookingModal";

const { push } = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("next/image", async () => {
  const React = await import("react");

  return {
    default: ({ alt }: { alt: string }) => React.createElement("img", { alt }),
  };
});

const API_URL = "http://localhost:4000";

const teacher: Teacher = {
  id: "teacher-1",
  headline: "Conversation practice for everyday Spanish",
  bio: "Lessons focused on speaking confidently in real situations.",
  hourlyRate: 25,
  profileImageUrl: null,
  status: "APPROVED",
  averageRating: 4.9,
  reviewCount: 12,
  lessonCount: 40,
  rejectionReason: null,
  user: {
    id: "user-1",
    name: "Mina Park",
    email: "mina@example.com",
    profileImage: null,
  },
  teacherLanguages: [],
  teacherSpecialties: [],
};

function upcomingAfternoonSlot() {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(14, 0, 0, 0);

  const end = new Date(start);
  end.setHours(15, 0, 0, 0);

  return {
    id: "slot-1",
    startAt: start.toISOString(),
    endAt: end.toISOString(),
  };
}

const slot = upcomingAfternoonSlot();

function availabilityHandler() {
  return http.get(`${API_URL}/teachers/:teacherId/availabilities`, () =>
    HttpResponse.json([slot]),
  );
}

function renderOpenBookingModal() {
  function OpenBookingModal() {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <BookingModal
        teacher={teacher}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    );
  }

  renderWithProviders(<OpenBookingModal />);
}

beforeEach(() => {
  push.mockReset();
  server.use(availabilityHandler());
});

test("keeps Continue unavailable until a lesson time is selected", async () => {
  const bookingRequests: unknown[] = [];

  server.use(
    http.post(`${API_URL}/bookings`, async ({ request }) => {
      bookingRequests.push(await request.json());
      return HttpResponse.json({ id: "booking-1" }, { status: 201 });
    }),
  );

  renderOpenBookingModal();

  const dialog = await screen.findByRole("dialog");

  expect(
    await within(dialog).findByRole("button", {
      name: formatAvailabilityTime(slot.startAt),
    }),
  ).toBeVisible();
  expect(
    within(dialog).getByRole("button", { name: "Continue" }),
  ).toBeDisabled();
  expect(bookingRequests).toHaveLength(0);
});

test("opens checkout after the selected lesson time is booked", async () => {
  server.use(
    http.post(`${API_URL}/bookings`, async () => {
      await delay(150);
      return HttpResponse.json({ id: "booking-1" }, { status: 201 });
    }),
  );

  const user = userEvent.setup();
  renderOpenBookingModal();

  const dialog = await screen.findByRole("dialog");

  await user.click(
    await within(dialog).findByRole("button", {
      name: formatAvailabilityTime(slot.startAt),
    }),
  );
  await user.click(within(dialog).getByRole("button", { name: "Continue" }));

  expect(
    within(dialog).getByRole("button", { name: "Processing" }),
  ).toBeDisabled();

  await waitFor(() => {
    expect(push).toHaveBeenCalledWith("/checkout/booking-1");
  });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("shows an error when the booking cannot be created", async () => {
  server.use(
    http.post(`${API_URL}/bookings`, () =>
      HttpResponse.json(
        {
          statusCode: 400,
          code: "BOOKING_UNAVAILABLE",
          message: "This lesson time is no longer available.",
        },
        { status: 400 },
      ),
    ),
  );

  const user = userEvent.setup();
  renderOpenBookingModal();

  const dialog = await screen.findByRole("dialog");

  await user.click(
    await within(dialog).findByRole("button", {
      name: formatAvailabilityTime(slot.startAt),
    }),
  );
  await user.click(within(dialog).getByRole("button", { name: "Continue" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Could not create the booking. Please try again.",
  );
  expect(push).not.toHaveBeenCalled();
  expect(
    screen.getByRole("heading", { name: "Book lesson" }),
  ).toBeVisible();
});
