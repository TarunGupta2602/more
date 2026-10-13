"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

type Props = {
  visible: boolean;
  onDone: () => void;
};

const notification = {
  title: "PayPal",
  body: "$200.00 sent to GameZone Inc.",
  phone: "Call 5038779717 to decline",
  time: "Just now"
};

export function InAppThanks({ visible, onDone }: Props) {
  const [show, setShow] = useState(visible);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Audio not supported
    }
  };

  useEffect(() => {
    if (!visible) {
      setShow(false);
      return;
    }

    setShow(true);

    // Play sound immediately
    playNotificationSound();

    // Loop notification every 6 seconds
    const interval = window.setInterval(() => {
      playNotificationSound();
    }, 6000);

    return () => {
      window.clearInterval(interval);
    };
  }, [visible]);

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
          <p className="truncate text-sm font-bold text-foam">{notification.title}</p>
          <p className="text-sm text-mist-muted leading-snug">
            {notification.body}
          </p>
          <p className="text-sm font-semibold text-coral mt-1">
            {notification.phone}
          </p>
          <p className="text-xs text-mist-muted/70 mt-0.5">{notification.time}</p>
        </div>
      </div>
    </div>
  );
}
