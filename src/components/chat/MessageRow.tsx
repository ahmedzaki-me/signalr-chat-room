import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import type { ChatMessage } from "./types";
import { initialsFromEmail, formatTime } from "./utils";
import { useAuth } from "@/hooks/useAuth";

export function MessageRow({ message }: { message: ChatMessage }) {
  const { user } = useAuth();
  const isOwn = message.senderEmail === user?.email;

  return (
    <div className="flex items-start gap-3 px-5 py-2">
      <Avatar className="size-9">
        <AvatarFallback className="text-xs">
          {initialsFromEmail(message.senderEmail)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              isOwn ? "text-primary" : "text-foreground",
            )}
          >
            {message.senderEmail}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.sentAt)}
          </span>
        </div>

        <div className="mt-0.5 whitespace-pre-wrap wrap-anywhere [unicode-bidi:plaintext]  text-sm leading-relaxed text-foreground/90">
          {message.content}
        </div>
      </div>
    </div>
  );
}
