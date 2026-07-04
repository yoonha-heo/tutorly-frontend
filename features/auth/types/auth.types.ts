export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export type TeacherStatus = "PENDING" | "APPROVED" | "REJECTED";

export type TeacherProfileSummary = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export type Me = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  profileImage: string | null;
  teacherProfile: TeacherProfileSummary;
};
