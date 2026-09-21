"use client";

import { createContext, useContext } from "react";

export type PendingChatOpen = {
  channelId: string;
  nonce: number;
};

type OpenChatContextValue = {
  pendingChatOpen: PendingChatOpen | null;
  openChatChannel: (channelId: string) => void;
  clearPendingChatOpen: () => void;
};

export const OpenChatContext = createContext<OpenChatContextValue>({
  pendingChatOpen: null,
  openChatChannel: () => {},
  clearPendingChatOpen: () => {},
});

export function useOpenChatChannel() {
  return useContext(OpenChatContext).openChatChannel;
}

export function usePendingChatOpen() {
  return useContext(OpenChatContext).pendingChatOpen;
}

export function useClearPendingChatOpen() {
  return useContext(OpenChatContext).clearPendingChatOpen;
}
