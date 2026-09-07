import type { ReactNode } from "react";

import Footer from "@/components/Footer";

type FooterLayoutProps = {
  children: ReactNode;
};

export default function FooterLayout({ children }: FooterLayoutProps) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
