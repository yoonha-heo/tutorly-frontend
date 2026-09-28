import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { Toaster } from "sonner";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import type { Booking } from "@/features/bookings/api/bookings.api";
import { server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/renderWithProviders";

import { MyLessonsClient } from "./MyLessonsClient";

const { refresh } = vi.hoisted(() => ({
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh,
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

function lesson(status: Booking["status"], id = "booking-1"): Booking {
  const start = new Date();
  start.setDate(start.getDate() + (status === "COMPLETED" ? -3 : 3));
  start.setHours(14, 0, 0, 0);
  const end = new Date(start);
  end.setHours(15, 0, 0, 0);

  return {
    id,
    teacherId: "teacher-1",
    studentId: "student-1",
    availabilityId: "slot-1",
    lessonType: "STANDARD",
    lessonStartAt: start.toISOString(),
    lessonEndAt: end.toISOString(),
    price: 25,
    status,
    meetingUrl: null,
    paymentExpiresAt: null,
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

let lessons: Booking[] = [];

function renderLessons() {
  renderWithProviders(
    <>
      <MyLessonsClient />
      <Toaster />
    </>,
  );
}

beforeEach(() => {
  lessons = [];
  refresh.mockReset();
  vi.spyOn(window, "confirm").mockReturnValue(false);
  server.use(
    http.get(`${API_URL}/bookings/me`, () => HttpResponse.json(lessons)),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("does not cancel a lesson when the confirmation is dismissed", async () => {
  lessons = [lesson("CONFIRMED")];
  const cancelRequests: string[] = [];

  server.use(
    http.post(`${API_URL}/bookings/:bookingId/cancel`, ({ params }) => {
      cancelRequests.push(String(params.bookingId));
      return HttpResponse.json({ success: true });
    }),
  );

  const user = userEvent.setup();
  renderLessons();

  await user.click(await screen.findByRole("button", { name: "Cancel" }));

  expect(window.confirm).toHaveBeenCalledWith(
    "Cancel this lesson? This cannot be undone.",
  );
  expect(cancelRequests).toHaveLength(0);
  expect(screen.getByRole("link", { name: "Mina Park" })).toBeVisible();
});

test("removes a lesson after it is cancelled", async () => {
  lessons = [lesson("CONFIRMED")];
  vi.mocked(window.confirm).mockReturnValue(true);

  server.use(
    http.post(`${API_URL}/bookings/:bookingId/cancel`, async () => {
      await delay(150);
      lessons = [];
      return HttpResponse.json({ success: true });
    }),
  );

  const user = userEvent.setup();
  renderLessons();

  await user.click(await screen.findByRole("button", { name: "Cancel" }));

  expect(screen.getByRole("button", { name: "Canceling..." })).toBeDisabled();

  expect(await screen.findByText("Lesson cancelled.")).toBeVisible();
  expect(
    screen.getByRole("heading", { name: "No lessons with this status" }),
  ).toBeVisible();
  expect(
    screen.queryByRole("link", { name: "Mina Park" }),
  ).not.toBeInTheDocument();
});

test("submits a review for a completed lesson", async () => {
  lessons = [lesson("COMPLETED")];

  server.use(
    http.post(`${API_URL}/reviews`, async () => {
      await delay(150);
      lessons = [{ ...lessons[0], review: { id: "review-1" } }];
      return HttpResponse.json(
        {
          id: "review-1",
          bookingId: "booking-1",
          rating: 5,
          comment: "The lesson was clear and encouraging.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { status: 201 },
      );
    }),
  );

  const user = userEvent.setup();
  renderLessons();

  await user.click(
    await screen.findByRole("button", { name: "Write a review" }),
  );

  const dialog = await screen.findByRole("dialog");
  await user.click(
    within(dialog).getByRole("button", { name: "Rate 5 stars" }),
  );
  await user.type(
    within(dialog).getByRole("textbox", { name: "Your review" }),
    "The lesson was clear and encouraging.",
  );
  await user.click(
    within(dialog).getByRole("button", { name: "Submit review" }),
  );

  expect(
    within(dialog).getByRole("button", { name: "Submitting" }),
  ).toBeDisabled();

  expect(await screen.findByText("Review submitted.")).toBeVisible();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Write a review" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Book again" })).toBeVisible();
});
