const ICON = "/icons/icon-192.png";

export async function registerParvahWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    return await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  } catch {
    return null;
  }
}

export async function sendThanksNotification(): Promise<"shown" | "denied" | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  const registration = await registerParvahWorker();
  await navigator.serviceWorker?.ready.catch(() => null);

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    return permission === "denied" ? "denied" : "unsupported";
  }

  const options: NotificationOptions = {
    body: "Thanks for using this site",
    icon: ICON,
    badge: ICON,
    tag: "parvah-thanks",
  };

  if (registration) {
    await registration.showNotification("Parvah", options);
  } else {
    new Notification("Parvah", options);
  }

  return "shown";
}
