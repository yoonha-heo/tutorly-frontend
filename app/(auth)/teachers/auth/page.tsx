import AuthForm from "@/features/auth/components/AuthForm";

export default function TeacherAuthPage() {
  return (
    <AuthForm
      title="Become a tutor"
      description="Sign in with Google to create your tutor account."
      role="TEACHER"
    />
  );
}
