self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title ?? "Pizza update";
  const body = data.body ?? "Your pizza status changed";

  console.log("PUSH RECEIVED", event.data?.text());

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/pwa-192.png",
      badge: "/pwa-192.png",
      data: data.url ? { url: data.url } : undefined,
    }),
  );
});
