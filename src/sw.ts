/// <reference lib="webworker" />
export {};

import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data: { title?: string; body?: string; url?: string };

  try {
    data = event.data?.json() ?? {};
  } catch {
    const fallbackText = event.data?.text();
    data = { title: "New message", body: fallbackText || "" };
  }

  event.waitUntil(
    self.registration.showNotification(data.title ?? "New message", {
      body: data.body ?? "",
      icon: "/Logo.png",
      data: { url: data.url ?? "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data?.url ?? "/"));
});
