import AuthForm from "@/features/auth/components/AuthForm";

type LoginPageProps = {
  searchParams: Promise<{
    intent?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { intent } = await searchParams;

  return (
    <AuthForm initialRole={intent === "teacher" ? "TEACHER" : "STUDENT"} />
  );
}
