import { z } from "zod";

export const teacherRegisterSchema = z.object({
  headline: z.string().min(5, "Headline must be at least 5 characters"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  hourlyRate: z.coerce.number().min(1, "Hourly rate must be greater than 0"),

  // 선택한 파일
  profileImage: z.instanceof(File).optional(),

  // 업로드 후 서버에 저장할 URL
  profileImageUrl: z.string(),

  languages: z.array(z.string()),
  specialties: z.array(z.string()),
});
export type TeacherRegisterInput = z.input<typeof teacherRegisterSchema>;
export type TeacherRegisterValues = z.output<typeof teacherRegisterSchema>;
