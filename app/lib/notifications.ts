const ICON_PATH = "/icons/icon-192.png";

function iconUrl() {
  return new URL(ICON_PATH, window.location.origin).href;
}

export async function registerParvahWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;
    return registration;
  } catch {
    return null;
  }
}

export async function sendThanksNotification(): Promise<"shown" | "denied" | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  const registration = await registerParvahWorker();

  let permission = Notification.permission;
  if (permission === "default") {
    // Must stay in the user-gesture chain from the button click.
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    return permission === "denied" ? "denied" : "unsupported";
  }

  const title = "Parvah";
  const options: NotificationOptions = {
    body: "Thanks for using this site",
    icon: iconUrl(),
    badge: iconUrl(),
    tag: "parvah-thanks",
  };

  // Focused tabs often suppress SW banners — use the Notification constructor first.
  try {
    const n = new Notification(title, options);
    n.onclick = () => {
      window.focus();
      n.close();
    };
    return "shown";
  } catch {
    /* fall through to service worker */
  }

  if (registration) {
    await registration.showNotification(title, options);
    return "shown";
  }

  return "unsupported";
}
