import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { beforeEach, expect, test, vi } from "vitest";

import type { Me } from "@/features/auth/types/auth.types";
import { server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/renderWithProviders";

import { TeacherRegistrationClient } from "./TeacherRegistrationClient";

const { replace } = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace,
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

const API_URL = "http://localhost:4000";
const headlinePlaceholder =
  "e.g. Certified Spanish tutor — speak with confidence";
const bioPlaceholder =
  "Tell learners about your teaching style, experience, and what a lesson with you looks like.";

function buildMe(
  role: Me["role"],
  teacherProfile: Me["teacherProfile"] | null = null,
): Me {
  return {
    id: "user-1",
    email: "mina@example.com",
    name: "Mina Park",
    role,
    profileImage: null,
    teacherProfile: teacherProfile as Me["teacherProfile"],
  };
}

function meHandler(user: Me | null) {
  return http.get(`${API_URL}/auth/me`, () => {
    if (!user) {
      return HttpResponse.json(
        { statusCode: 401, code: "UNAUTHORIZED", message: "Unauthorized" },
        { status: 401 },
      );
    }

    return HttpResponse.json({ user });
  });
}

beforeEach(() => {
  replace.mockReset();
  server.use(
    http.post(`${API_URL}/auth/refresh`, () =>
      HttpResponse.json(
        { statusCode: 401, code: "UNAUTHORIZED", message: "Unauthorized" },
        { status: 401 },
      ),
    ),
    http.get(`${API_URL}/teachers/languages`, () => HttpResponse.json([])),
    http.get(`${API_URL}/teachers/specialties`, () => HttpResponse.json([])),
    meHandler(buildMe("TEACHER")),
  );
});

test("sends visitors who cannot register away from the form", async () => {
  const blockedVisitors: Array<{ user: Me | null; destination: string }> = [
    {
      user: null,
      destination: "/login?intent=teacher&callbackUrl=/teachers/registration",
    },
    {
      user: buildMe("STUDENT"),
      destination: "/teachers",
    },
    {
      user: buildMe("TEACHER", { id: "profile-1", status: "APPROVED" }),
      destination: "/teachers/dashboard",
    },
  ];

  for (const visitor of blockedVisitors) {
    replace.mockClear();
    server.use(meHandler(visitor.user));
    renderWithProviders(<TeacherRegistrationClient />);

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith(visitor.destination);
    });
    expect(
      screen.queryByRole("heading", { name: "Become a Tutorly teacher" }),
    ).not.toBeInTheDocument();

    cleanup();
  }

  replace.mockClear();
  server.use(meHandler(buildMe("TEACHER")));
  renderWithProviders(<TeacherRegistrationClient />);

  expect(
    await screen.findByRole("heading", { name: "Become a Tutorly teacher" }),
  ).toBeVisible();
  expect(replace).not.toHaveBeenCalled();
});

test("shows validation errors and does not submit an incomplete profile", async () => {
  const profileRequests: unknown[] = [];

  server.use(
    http.post(`${API_URL}/teachers/profile`, async ({ request }) => {
      profileRequests.push(await request.json());
      return HttpResponse.json({ id: "profile-1" }, { status: 201 });
    }),
  );

  const user = userEvent.setup();
  renderWithProviders(<TeacherRegistrationClient />);

  await user.click(
    await screen.findByRole("button", { name: "Submit for review" }),
  );

  expect(
    await screen.findByText("Headline must be at least 5 characters"),
  ).toBeVisible();
  expect(screen.getByText("Bio must be at least 20 characters")).toBeVisible();
  expect(profileRequests).toHaveLength(0);
  expect(replace).not.toHaveBeenCalled();
});

test("opens the teacher dashboard after a profile is submitted", async () => {
  server.use(
    http.post(`${API_URL}/teachers/profile`, async () => {
      await delay(150);
      return HttpResponse.json({ id: "profile-1" }, { status: 201 });
    }),
  );

  const user = userEvent.setup();
  renderWithProviders(<TeacherRegistrationClient />);

  await user.type(
    await screen.findByPlaceholderText(headlinePlaceholder),
    "Spanish conversation tutor",
  );
  await user.type(
    screen.getByPlaceholderText(bioPlaceholder),
    "I help learners speak Spanish with confidence in everyday situations.",
  );
  await user.click(screen.getByRole("button", { name: "Submit for review" }));

  expect(screen.getByRole("button", { name: "Submitting..." })).toBeDisabled();

  await waitFor(() => {
    expect(replace).toHaveBeenCalledWith("/teachers/dashboard");
  });
});

test("shows an error when the profile cannot be submitted", async () => {
  const consoleError = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined);

  server.use(
    http.post(`${API_URL}/teachers/profile`, () =>
      HttpResponse.json(
        {
          statusCode: 400,
          code: "PROFILE_REJECTED",
          message: "This profile could not be saved.",
        },
        { status: 400 },
      ),
    ),
  );

  const user = userEvent.setup();
  renderWithProviders(<TeacherRegistrationClient />);

  await user.type(
    await screen.findByPlaceholderText(headlinePlaceholder),
    "Spanish conversation tutor",
  );
  await user.type(
    screen.getByPlaceholderText(bioPlaceholder),
    "I help learners speak Spanish with confidence in everyday situations.",
  );
  await user.click(screen.getByRole("button", { name: "Submit for review" }));

  expect(
    await screen.findByText("Failed to submit profile. Please try again."),
  ).toBeVisible();
  expect(replace).not.toHaveBeenCalled();
  expect(
    screen.getByRole("heading", { name: "Become a Tutorly teacher" }),
  ).toBeVisible();

  consoleError.mockRestore();
});
