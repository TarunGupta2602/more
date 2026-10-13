"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  visible: boolean;
  onDone: () => void;
};

export function InAppThanks({ visible, onDone }: Props) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (!visible) {
      setShow(false);
      return;
    }

    setShow(true);
    const t = window.setTimeout(() => {
      setShow(false);
      onDone();
    }, 4200);

    return () => window.clearTimeout(t);
  }, [visible, onDone]);

  if (!show) return null;

  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] animate-fade-up"
    >
      <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-line bg-ink-soft/95 px-3 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <Image
          src="/icons/icon-192.png"
          alt="Parvah"
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-xl"
          priority
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foam">Parvah</p>
          <p className="truncate text-sm text-mist-muted">
            Thanks for using this site
          </p>
        </div>
      </div>
    </div>
  );
}
