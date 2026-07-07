import { Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { ChatUser } from "./types";
import { initialsFromEmail } from "./utils";


export function MembersSidebar({ users }: { users: ChatUser[] }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-e border-sidebar-border bg-sidebar sm:flex">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-3">
        <Users className="size-4 text-muted-foreground" />
        <span className="text-xs font-medium text-sidebar-foreground">
          Members
        </span>
        <Badge variant="secondary" className="ms-auto">
          {users.length}
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent"
            >
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">
                  {initialsFromEmail(user.email)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-sm text-sidebar-foreground">
                {user.email}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
