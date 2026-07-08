import { api } from "@/api/axios";

/**
 * Converts a URL-safe Base64 encoded VAPID public key into a Uint8Array.
 * * @param base64 - The VAPID public key string received from the backend.
 * @returns A Uint8Array representation of the key required by the Web Push API.
 * * @note Cross-Browser Compatibility:
 * According to the W3C Web Push specification, `applicationServerKey` must be a `BufferSource`.
 * While modern Chromium-based browsers (Chrome, Edge) automatically handle raw string keys
 * under the hood, Safari (especially on iOS 16.4+) and Firefox strictly adhere to the spec
 * and will throw a `TypeError` if a string is passed directly.
 * Maintaining this utility ensures robust cross-platform notification support.
 */
function urlBase64ToUint8Array(base64: string) {
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const raw = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function sendSubscriptionToServer(subscription: PushSubscription) {
  const { endpoint, keys } = subscription.toJSON() as {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };

  await api.post("/api/v1/notifications/subscribe", { endpoint, ...keys });
}

export async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const { data } = await api.get<{ publicKey: string }>(
      "/api/v1/notifications/public-key",
    );
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    });
  }
  await sendSubscriptionToServer(subscription);
}

export async function unsubscribeFromPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  await api.post("/api/v1/notifications/unsubscribe", {
    endpoint: subscription.endpoint,
  });
  await subscription.unsubscribe();
}
