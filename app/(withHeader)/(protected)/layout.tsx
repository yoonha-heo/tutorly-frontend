import { AuthGuard } from "@/components/auth/AuthGaurd";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: Props) {
  return <AuthGuard loginPath="/login">{children}</AuthGuard>;
}
