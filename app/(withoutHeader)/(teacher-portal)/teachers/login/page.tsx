import { redirect } from "next/navigation";

type TeacherLoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function TeacherLoginPage({
  searchParams,
}: TeacherLoginPageProps) {
  const { callbackUrl } = await searchParams;
  const params = new URLSearchParams({ intent: "teacher" });

  if (callbackUrl) {
    params.set("callbackUrl", callbackUrl);
  }

  redirect(`/login?${params.toString()}`);
}
