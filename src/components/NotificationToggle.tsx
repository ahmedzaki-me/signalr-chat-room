import { Bell } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { usePushNotifications } from "@/hooks/usePushNotifications";

export function NotificationToggle() {
  const { enabled, permission, isLoading, enable, disable } =
    usePushNotifications();

  const isBlocked = permission === "denied" || permission === "unsupported";

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-1">
        <Label className="flex items-center gap-2">
          <Bell className="size-4" />
          Push Notifications
        </Label>

        <p className="text-muted-foreground text-sm">
          Receive notifications when new messages arrive.
        </p>

        {permission === "denied" && (
          <p className="text-destructive text-xs">
            Notifications are blocked in your browser settings.
          </p>
        )}

        {permission === "unsupported" && (
          <p className="text-muted-foreground text-xs">
            Push notifications aren&apos;t supported in this browser.
          </p>
        )}
      </div>

      <Switch
        checked={enabled}
        disabled={isLoading || isBlocked}
        onCheckedChange={(checked) => {
          if (checked) {
            void enable();
          } else {
            void disable();
          }
        }}
      />
    </div>
  );
}
