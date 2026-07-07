import { useEffect, useMemo, useRef, useState } from "react";
import type { HubConnection } from "@microsoft/signalr";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useAuth } from "@/hooks/useAuth";
import { createChatConnection } from "@/services/chatConnection";
import { getMessages } from "@/services/messages";
import { logout } from "@/services/auth.service";

import type { ChatMessage, ChatUser } from "./types";
import { formatDay } from "./utils";
import { ChatHeader } from "./ChatHeader";
import { MembersSidebar } from "./MembersSidebar";
import { MessageRow } from "./MessageRow";
import { DayDivider } from "./DayDivider";
import { Composer } from "./Composer";

type TimelineItem =
  | { key: string; type: "divider"; label: string }
  | { key: string; type: "message"; message: ChatMessage };

export default function ChatRoom() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { accessToken, clearAuth } = useAuth();

  const connectionRef = useRef<HubConnection | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const data = await getMessages();
      setMessages(data);
    };
    loadMessages();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const connection = createChatConnection(accessToken);
    connectionRef.current = connection;

    connection.on("ReceiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    connection.start();

    return () => {
      connection.stop();
      connectionRef.current = null;
    };
  }, [accessToken]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const users = useMemo<ChatUser[]>(() => {
    const usersMap = new Map<string, ChatUser>();
    for (const message of messages) {
      usersMap.set(message.senderEmail, {
        id: message.senderEmail,
        email: message.senderEmail,
      });
    }

    return [...usersMap.values()];
  }, [messages]);

  const timeline = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [];
    let lastDay: string | null = null;

    for (const message of messages) {
      const day = formatDay(message.sentAt);
      if (day !== lastDay) {
        items.push({
          key: `divider-${message.id}`,
          type: "divider",
          label: day,
        });
        lastDay = day;
      }
      items.push({ key: message.id, type: "message", message });
    }

    return items;
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    await connectionRef.current?.invoke("SendMessage", message);
  };

  const handleLogout = async () => {
    try {
      await connectionRef.current?.stop();
      await logout();
    } finally {
      clearAuth();
    }
  };
  return (
    <div className="mx-auto flex h-screen w-full flex-col overflow-hidden bg-background shadow-sm">
      <ChatHeader onLogout={handleLogout} />

      <div className="flex min-h-0 flex-1">
        <MembersSidebar users={users} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">
            <ScrollArea className="h-full">
              <div className="py-2">
                {timeline.map((item) =>
                  item.type === "divider" ? (
                    <DayDivider key={item.key} label={item.label} />
                  ) : (
                    <MessageRow key={item.key} message={item.message} />
                  ),
                )}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>
          </div>

          <Composer onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
