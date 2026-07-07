import { FolderGit2, Radio, Settings } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { LogoutButton } from "./LogoutButton";
import { NotificationToggle } from "../NotificationToggle";

export function ChatHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="border-b bg-card">
      <div className="flex items-start justify-between p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>

            <Radio className="size-4 text-primary" />

            <h1 className="text-lg font-semibold">Chat Room</h1>
          </div>

          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <FolderGit2 className="size-3.5" />

            <span>Made with</span>

            <a
              href="https://github.com/ahmedzaki-me"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              Ahmed Zaki
            </a>

            <span>&</span>

            <a
              href="https://github.com/..."
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              Mohamed Ehab
            </a>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-6">
              <NotificationToggle />

              <LogoutButton onLogout={onLogout} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
