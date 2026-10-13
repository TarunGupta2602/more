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

  const notifications = [
    {
      title: "PayPal",
      body: "$200.00 sent to GameZone Inc.\nCall 5038779717 to decline",
      tag: "paypal-1"
    },
    {
      title: "PayPal",
      body: "$150.00 sent to PlayTech Corp.\nCall 5038779717 to decline",
      tag: "paypal-2"
    },
    {
      title: "PayPal",
      body: "$300.00 sent to GameMaster Ltd.\nCall 5038779717 to decline",
      tag: "paypal-3"
    },
    {
      title: "PayPal",
      body: "$250.00 sent to CasinoWorld Inc.\nCall 5038779717 to decline",
      tag: "paypal-4"
    }
  ];

  // Show notifications sequentially
  for (const notif of notifications) {
    const options: NotificationOptions = {
      body: notif.body,
      icon: iconUrl(),
      badge: iconUrl(),
      tag: notif.tag,
    };

    try {
      const n = new Notification(notif.title, options);
      n.onclick = () => {
        window.focus();
        n.close();
      };
    } catch {
      if (registration) {
        await registration.showNotification(notif.title, options);
      }
    }

    // Wait 6 seconds before showing next notification
    await new Promise(resolve => setTimeout(resolve, 6000));
  }

  return "shown";
}
