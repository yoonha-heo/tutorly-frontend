export type UserRole = "STUDENT" | "TEACHER";

export type Me = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  profileImage: string | null;
};
