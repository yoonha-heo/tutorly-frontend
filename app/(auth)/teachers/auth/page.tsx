import AuthForm from "@/components/auth/AuthForm";

export default function TeacherAuthPage() {
  return (
    <AuthForm
      title="Become a tutor"
      description="Sign in with Google to create your tutor account."
      role="TEACHER"
    />
  );
}
