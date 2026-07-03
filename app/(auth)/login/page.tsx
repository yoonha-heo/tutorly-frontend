import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <AuthForm
      title="Welcome back"
      description="Sign in with Google to start booking lessons."
      role="STUDENT"
    />
  );
}
