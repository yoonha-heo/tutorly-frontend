import { env } from "@/config/env";
import { apiFetch } from "@/utils/apiClient";

export type LessonType = "STANDARD";

export type BookingStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED"
  | "REFUND_PROCESSING";

export type Booking = {
  id: string;
  teacherId: string;
  studentId: string;
  availabilityId: string;
  lessonType: LessonType;
  lessonStartAt: string;
  lessonEndAt: string;
  price: number;
  status: BookingStatus;
  meetingUrl: string | null;
  paymentExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  teacher: {
    id: string;
    timezone: string;
    headline: string;
    profileImageUrl: string | null;
    hourlyRate: number;
    user: {
      id: string;
      name: string;
    };
  };
  review: { id: string } | null;
};

export type TeachingBookingStatus = Extract<
  BookingStatus,
  "CONFIRMED" | "COMPLETED"
>;

export type TeachingBooking = {
  id: string;
  teacherId: string;
  studentId: string;
  availabilityId: string;
  lessonType: LessonType;
  lessonStartAt: string;
  lessonEndAt: string;
  price: number;
  status: TeachingBookingStatus;
  meetingUrl: string | null;
  paymentExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
};

export type CreateBookingData = {
  availabilityId: string;
  lessonType: LessonType;
};

export async function createBooking(data: CreateBookingData) {
  return apiFetch<Booking>(`${env.apiUrl}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
}

export async function getMyTeachingBookings(): Promise<TeachingBooking[]> {
  return apiFetch<TeachingBooking[]>(`${env.apiUrl}/bookings/teaching`, {
    credentials: "include",
  });
}

export async function getMyBookings(): Promise<Booking[]> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    if (cookieString) {
      headers["Cookie"] = cookieString;
    }
  }

  return apiFetch<Booking[]>(`${env.apiUrl}/bookings/me`, {
    headers,
    credentials: "include",
    cache: "no-store",
  });
}

export type CancelBookingResponse = {
  success: boolean;
};

export async function cancelBooking(bookingId: string) {
  return apiFetch<CancelBookingResponse>(
    `${env.apiUrl}/bookings/${bookingId}/cancel`,
    {
      method: "POST",
      credentials: "include",
    },
  );
}
