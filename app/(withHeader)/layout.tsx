import type { CSSProperties, ReactNode } from "react";
import { Toaster } from "sonner";

import Header from "@/components/Header";
import { ChatSocketProvider } from "@/features/chats/components/ChatSocketProvider";

type MainLayoutProps = {
  children: ReactNode;
};

const chatToasterStyle = {
  zIndex: 40,
  "--width": "24rem",
} as CSSProperties;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <ChatSocketProvider>
      <Header />
      {children}
      <Toaster
        id="chat-notifications"
        position="top-right"
        visibleToasts={3}
        offset={{ top: "calc(4.5rem + 12px)", right: "16px" }}
        mobileOffset={{ top: "calc(4.5rem + 8px)", right: "12px", left: "12px" }}
        toastOptions={{ unstyled: true }}
        style={chatToasterStyle}
      />
    </ChatSocketProvider>
  );
}
