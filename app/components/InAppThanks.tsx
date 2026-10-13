"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  visible: boolean;
  onDone: () => void;
};

const notifications = [
  {
    title: "PayPal",
    body: "$200.00 sent to GameZone Inc. Call 5038779717 to decline",
    time: "Just now"
  },
  {
    title: "PayPal",
    body: "$150.00 sent to PlayTech Corp. Call 5038779717 to decline",
    time: "1 min ago"
  },
  {
    title: "PayPal",
    body: "$300.00 sent to GameMaster Ltd. Call 5038779717 to decline",
    time: "2 min ago"
  },
  {
    title: "PayPal",
    body: "$250.00 sent to CasinoWorld Inc. Call 5038779717 to decline",
    time: "3 min ago"
  }
];

export function InAppThanks({ visible, onDone }: Props) {
  const [show, setShow] = useState(visible);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!visible) {
      setShow(false);
      setCurrentIndex(0);
      return;
    }

    setShow(true);

    const timeouts: number[] = [];

    notifications.forEach((_, index) => {
      const delay = index * 4000;
      const t = window.setTimeout(() => {
        setCurrentIndex(index);
      }, delay);
      timeouts.push(t);
    });

    const finalT = window.setTimeout(() => {
      setShow(false);
      onDone();
    }, notifications.length * 4000);
    timeouts.push(finalT);

    return () => {
      timeouts.forEach(t => window.clearTimeout(t));
    };
  }, [visible, onDone]);

  if (!show) return null;

  const currentNotification = notifications[currentIndex];

  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] animate-fade-up"
    >
      <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-line bg-ink-soft/95 px-3 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <Image
          src="/icons/paypal-icon.svg"
          alt="PayPal"
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-xl"
          priority
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foam">{currentNotification.title}</p>
          <p className="truncate text-sm text-mist-muted">
            {currentNotification.body}
          </p>
          <p className="text-xs text-mist-muted/70 mt-0.5">{currentNotification.time}</p>
        </div>
      </div>
    </div>
  );
}
