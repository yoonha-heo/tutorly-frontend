import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { Toaster } from "sonner";
import { beforeEach, expect, test, vi } from "vitest";

import type { Booking } from "@/features/bookings/api/bookings.api";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { server } from "@/test/msw/server";

import { CheckoutClient } from "./CheckoutClient";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
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

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: () => Promise.resolve({}),
}));

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => children,
  PaymentElement: () => null,
  useStripe: () => ({ confirmPayment: vi.fn() }),
  useElements: () => ({}),
}));

const API_URL = "http://localhost:4000";

function booking(paymentExpiresAt: string | null): Booking {
  const start = new Date();
  start.setDate(start.getDate() + 2);
  start.setHours(14, 0, 0, 0);
  const end = new Date(start);
  end.setHours(15, 0, 0, 0);

  return {
    id: "booking-1",
    teacherId: "teacher-1",
    studentId: "student-1",
    availabilityId: "slot-1",
    lessonType: "STANDARD",
    lessonStartAt: start.toISOString(),
    lessonEndAt: end.toISOString(),
    price: 25,
    status: "PENDING_PAYMENT",
    meetingUrl: null,
    paymentExpiresAt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    teacher: {
      id: "teacher-1",
      timezone: "Asia/Seoul",
      headline: "Spanish conversation",
      profileImageUrl: null,
      hourlyRate: 25,
      user: {
        id: "user-1",
        name: "Mina Park",
      },
    },
    review: null,
  };
}

function renderCheckout(currentBooking: Booking) {
  render(
    <ReactQueryProvider>
      <CheckoutClient booking={currentBooking} />
      <Toaster />
    </ReactQueryProvider>,
  );
}

beforeEach(() => {
  server.use(
    http.post(`${API_URL}/payments/intent`, () =>
      HttpResponse.json({
        clientSecret: "cs_test_secret",
        paymentIntentId: "pi_test",
      }),
    ),
  );
});

test("disables payment when the reservation has expired", async () => {
  renderCheckout(booking(new Date(Date.now() - 60_000).toISOString()));

  expect(await screen.findByRole("button", { name: "Pay $25" })).toBeDisabled();
  expect(screen.getByRole("status")).toHaveTextContent("0:00");
  expect(
    screen.getByText("Your lesson is reserved. Please complete payment."),
  ).toBeVisible();
});

test("shows the payment error when the payment intent is rejected", async () => {
  server.use(
    http.post(`${API_URL}/payments/intent`, () =>
      HttpResponse.json(
        {
          statusCode: 400,
          code: "PAYMENT_UNAVAILABLE",
          message: "This lesson is no longer reserved.",
        },
        { status: 400 },
      ),
    ),
  );

  renderCheckout(booking(new Date(Date.now() + 10 * 60_000).toISOString()));

  expect(
    await screen.findByText("This lesson is no longer reserved."),
  ).toBeVisible();
  expect(screen.getByText("Mina Park")).toBeVisible();
  expect(
    screen.queryByRole("button", { name: "Pay $25" }),
  ).not.toBeInTheDocument();
});
