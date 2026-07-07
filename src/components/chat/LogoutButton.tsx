import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";


interface LogoutButtonProps {
  onLogout?: () => void;
}

export function LogoutButton({ onLogout = () => {} }: LogoutButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onLogout}
      className="gap-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="size-4" />
      LogOut
    </Button>
  );
}
