import { FolderGit2, Radio } from "lucide-react";

import { LogoutButton } from "./LogoutButton";

export function ChatHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header className=" border-b border-border bg-card gap-3 p-3">
      <div className="flex gap-1 justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
          <Radio className="size-4 text-primary" />
          <h1 className="text-sm font-semibold text-foreground">Chat Room</h1>
        </div>
        <LogoutButton onLogout={onLogout} />
      </div>

      <a
        href="https://github.com/ahmedzaki-me/signalr-chat-room"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary w-full"
      >
        <FolderGit2 className="size-3.5" />
        signalr chat room · made with Ahmed Zaki &amp; Mohamed Ehab
      </a>
    </header>
  );
}
