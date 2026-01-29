const PUBLIC_VAPID_KEY =
  "BBFbYwT_grl_-S06M9rAarHVV2Sr1xR7l_1GqfhECxYZmMpRH7py7rdTgwt8S1TPnjOZPAKfgT6YASvwSdDcrio";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);

  return outputArray;
}

export async function subscribeToPush() {
  if (!("serviceWorker" in navigator)) return;

  const perm = await Notification.requestPermission();
  if (perm !== "granted") {
    alert("notifications not allowed");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
  });

  await fetch("http://localhost:3001/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  console.log("Subscribed:", subscription);
}