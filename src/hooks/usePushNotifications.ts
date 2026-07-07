import { useCallback, useEffect, useState } from "react";

import { subscribeToPush, unsubscribeFromPush } from "@/lib/push";

type Permission = NotificationPermission | "unsupported";

export function usePushNotifications() {
  const [permission, setPermission] = useState<Permission>(() => {
    if (!("Notification" in window)) return "unsupported";
    return Notification.permission;
  });

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setIsSubscribed(!!subscription))
      .catch(() => setIsSubscribed(false));
  }, []);

  const enabled = permission === "granted" && isSubscribed;

  const enable = useCallback(async () => {
    if (!("Notification" in window)) return;

    setIsLoading(true);
    try {
      let current = Notification.permission;

      if (current === "default") {
        current = await Notification.requestPermission();
      }

      setPermission(current);

      if (current !== "granted") return;

      await subscribeToPush();
      setIsSubscribed(true);
    } catch (err) {
      console.error("Push subscription failed:", err);
      setIsSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disable = useCallback(async () => {
    setIsLoading(true);
    try {
      await unsubscribeFromPush();
      setIsSubscribed(false);
    } catch (err) {
      console.error("Push unsubscribe failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    enabled,
    permission,
    isLoading,
    enable,
    disable,
  };
}
