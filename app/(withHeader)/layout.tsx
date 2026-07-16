import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
