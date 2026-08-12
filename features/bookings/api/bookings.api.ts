import { env } from "@/config/env";
import { apiFetch } from "@/utils/apiClient";
import { cookies } from "next/headers";

export type LessonType = "STANDARD";

export type BookingStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED"
  | "EXPIRED";

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

export async function getMyBookings(): Promise<Booking[]> {
  const cookieStore = await cookies();

  const cookieString = cookieStore.toString();

  return apiFetch<Booking[]>(`${env.apiUrl}/bookings/me`, {
    headers: {
      ...(cookieString && { Cookie: cookieString }),
      "Content-Type": "application/json",
    },
    // Server Component에서 최신 데이터를 보장받기 위한 설정 (필요에 따라 변경 가능)
    cache: "no-store",
  });
}
