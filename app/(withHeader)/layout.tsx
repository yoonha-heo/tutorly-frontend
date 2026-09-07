import type { ReactNode } from "react";

import Header from "@/components/Header";
import { ChatSocketProvider } from "@/features/chats/components/ChatSocketProvider";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <ChatSocketProvider>
      <Header />
      {children}
    </ChatSocketProvider>
  );
}
