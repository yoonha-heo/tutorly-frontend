import { env } from "@/config/env";
import { apiFetch } from "@/utils/apiClient";

export const MESSAGE_PAGE_SIZE = 20;

export type ChatUser = {
  id: string;
  name: string | null;
  profileImage: string | null;
};

export type ChatMessage = {
  id: string;
  channelId: string;
  senderId: string | null;
  content: string;
  type: "TEXT" | "SYSTEM";
  createdAt: string;
  sender: ChatUser | null;
};

export type ChatListItem = {
  id: string;
  otherUser: ChatUser | null;
  lastMessage: ChatMessage | null;
  unreadCount: number;
};

export type ChatListResponse = {
  items: ChatListItem[];
};

export type MessageListResponse = {
  items: ChatMessage[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

export type SendChatData = {
  recipientId: string;
  content: string;
};

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    if (cookieString) {
      headers["Cookie"] = cookieString;
    }
  }

  return headers;
}

export async function getChatList(): Promise<ChatListResponse> {
  return apiFetch<ChatListResponse>(`${env.apiUrl}/chats`, {
    headers: await getAuthHeaders(),
    credentials: "include",
    cache: "no-store",
  });
}

export async function getMessageList(
  channelId: string,
  params: { cursor?: string; limit?: number } = {},
): Promise<MessageListResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(params.limit ?? MESSAGE_PAGE_SIZE));

  if (params.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  return apiFetch<MessageListResponse>(
    `${env.apiUrl}/chats/${channelId}/messages?${searchParams.toString()}`,
    {
      headers: await getAuthHeaders(),
      credentials: "include",
      cache: "no-store",
    },
  );
}

export async function sendChat(data: SendChatData): Promise<ChatMessage> {
  return apiFetch<ChatMessage>(`${env.apiUrl}/chats`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  });
}

export async function markChatAsRead(channelId: string): Promise<void> {
  await apiFetch(`${env.apiUrl}/chats/${channelId}/read`, {
    method: "PATCH",
    credentials: "include",
  });
}
