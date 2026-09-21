import { redirect } from "next/navigation";

import { getMe } from "@/features/auth/api/authApi";
import { getChatList, getMessageList } from "@/features/chats/api/chats.api";
import { ChatsClient } from "@/features/chats/components/ChatsClient";

export default async function ChatsPage() {
  const me = await getMe();

  if (me?.role === "TEACHER" && me.teacherProfile?.status !== "APPROVED") {
    redirect("/teachers/dashboard");
  }

  const initialChats = await getChatList();
  const initialChannelId = initialChats.items[0]?.id;
  const initialMessages = initialChannelId
    ? await getMessageList(initialChannelId)
    : undefined;

  return (
    <ChatsClient
      initialChats={initialChats}
      initialMessages={initialMessages}
      initialChannelId={initialChannelId}
    />
  );
}
