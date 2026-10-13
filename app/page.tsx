"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { InAppThanks } from "./components/InAppThanks";
import {
  registerParvahWorker,
  sendThanksNotification,
} from "./lib/notifications";

const faqs = [
  {
    q: "Is random video chat free?",
    a: "Yes. Parvah is free — no registration, credits, or subscription.",
  },
  {
    q: "Do I need to sign up?",
    a: "No. Confirm you are 18+, allow camera access, and start matching.",
  },
  {
    q: "How does matching work?",
    a: "You join a live queue and get paired 1-on-1 with another adult. Tap Next to skip.",
  },
  {
    q: "Does it work on iPhone?",
    a: "Yes. Use Safari or Chrome, allow camera access, and start in the browser — no app download.",
  },
];

export default function Home() {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showThanks, setShowThanks] = useState(false);
  const [entering, setEntering] = useState(false);

  const hideThanks = useCallback(() => setShowThanks(false), []);

  useEffect(() => {
    void registerParvahWorker();
  }, []);

  const enterSite = async () => {
    if (entering) return;
    setEntering(true);
    // Show branded banner immediately on the same screen (before page swap).
    setShowThanks(true);
    // Keep this in the click gesture so the browser permission prompt works.
    await sendThanksNotification();
    setAgeConfirmed(true);
    setEntering(false);
  };

  return (
    <>
      <InAppThanks visible={showThanks} onDone={hideThanks} />

      {!ageConfirmed ? (
        <main className="relative min-h-dvh overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/hero-parvah.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,28,26,0.55)_0%,rgba(15,28,26,0.72)_45%,rgba(15,28,26,0.96)_100%)]" />
          </div>

          <div className="relative z-10 flex min-h-dvh flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
            <p className="animate-fade-up font-display text-[clamp(2.75rem,12vw,4.5rem)] font-extrabold leading-none tracking-tight text-foam">
              Parvah
            </p>

            <div className="mt-auto max-w-md animate-fade-up-delay-1">
              <h1 className="font-display text-[1.75rem] font-bold leading-tight text-foam sm:text-3xl">
                Adults only. Confirm your age to enter.
              </h1>
              <p className="mt-3 text-base leading-relaxed text-mist-muted">
                Parvah is for people 18 and older. Free random video chat — no
                signup required.
              </p>
            </div>

            <div className="mt-8 space-y-3 animate-fade-up-delay-2">
              <button
                type="button"
                onClick={enterSite}
                disabled={entering}
                className="btn-primary min-h-14 w-full rounded-2xl px-6 text-base font-bold text-foam shadow-[0_12px_40px_rgba(255,107,74,0.28)] disabled:opacity-70"
              >
                {entering ? "Entering…" : "I am 18 or older — Enter"}
              </button>
              <p className="text-center text-sm text-mist-muted">
                By entering, you agree to our Terms of Service.
              </p>
            </div>
          </div>
        </main>
      ) : (
    <div className="min-h-dvh bg-ink text-mist">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 pt-[env(safe-area-inset-top)] sm:h-16 sm:px-6">
          <a
            href="#top"
            className="font-display text-xl font-extrabold tracking-tight text-foam sm:text-2xl"
          >
            Parvah
          </a>
          <a
            href="https://parvah.online"
            className="btn-primary inline-flex min-h-10 items-center rounded-xl px-4 text-sm font-bold text-foam"
          >
            Chat Now
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/hero-parvah.jpg"
              alt="Late-night video chat atmosphere"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,28,26,0.35)_0%,rgba(15,28,26,0.55)_40%,rgba(15,28,26,0.94)_78%,var(--ink)_100%)]" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-5xl flex-col justify-end px-5 pb-28 pt-10 sm:px-6 sm:pb-24">
            <h1 className="font-display text-[clamp(3.25rem,14vw,6rem)] font-extrabold leading-[0.92] tracking-tight text-foam animate-fade-up">
              Parvah
            </h1>

            <p className="mt-4 max-w-md font-display text-xl font-semibold leading-snug text-foam sm:text-2xl animate-fade-up-delay-1">
              Free random video chat. No signup.
            </p>

            <p className="mt-3 max-w-sm text-base leading-relaxed text-mist-muted animate-fade-up-delay-2">
              Instant 1-on-1 webcam matching in your browser. Adults 18+ only.
            </p>

            <div
              id="start"
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center animate-fade-up-delay-3"
            >
              <a
                href="https://parvah.online"
                className="btn-primary inline-flex min-h-14 items-center justify-center rounded-2xl px-7 text-base font-bold text-foam shadow-[0_12px_40px_rgba(255,107,74,0.28)]"
              >
                Start Video Chat
              </a>
              <a
                href="#faq"
                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-line px-7 text-base font-semibold text-mist transition-colors hover:bg-white/5"
              >
                How it works
              </a>
            </div>

            <p className="mt-4 text-sm text-mist-muted">
              Allow camera access when prompted.
            </p>
          </div>
        </section>

        <section id="how" className="px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foam sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-base text-mist-muted">
              Four taps from age check to a live match.
            </p>

            <ol className="mt-10 space-y-8">
              {[
                {
                  step: "01",
                  title: "Pass the age gate",
                  body: "Parvah is strictly for adults. Minors are not allowed.",
                },
                {
                  step: "02",
                  title: "Allow camera access",
                  body: "Grant browser permissions so live WebRTC video can start.",
                },
                {
                  step: "03",
                  title: "Join the live queue",
                  body: "You are paired with another available adult.",
                },
                {
                  step: "04",
                  title: "Chat or skip",
                  body: "Stay as long as you want. Use Next to skip or Report for abuse.",
                },
              ].map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span className="font-display text-sm font-bold tabular-nums text-coral">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-foam">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-base leading-relaxed text-mist-muted">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-line bg-ink-soft/60 px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foam sm:text-4xl">
              Built for your phone
            </h2>
            <p className="mt-3 text-base text-mist-muted">
              Fast matching in Safari or Chrome — no app install.
            </p>

            <ul className="mt-10 space-y-6">
              {[
                {
                  title: "Instant matching",
                  body: "Join the queue and get paired in seconds for live 1-on-1 video.",
                },
                {
                  title: "No signup friction",
                  body: "No email, credits, or profile setup — confirm 18+ and go.",
                },
                {
                  title: "Privacy controls",
                  body: "Peer-to-peer WebRTC, skip and report tools, clear adult rules.",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="border-t border-line pt-6 first:border-t-0 first:pt-0"
                >
                  <h3 className="text-lg font-semibold text-foam">{item.title}</h3>
                  <p className="mt-1 text-base leading-relaxed text-mist-muted">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="faq" className="px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foam sm:text-4xl">
              Quick FAQ
            </h2>
            <p className="mt-3 text-base text-mist-muted">
              Straight answers before you start.
            </p>

            <div className="mt-8 divide-y divide-line border-y border-line">
              {faqs.map((item, index) => {
                const open = openFaq === index;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenFaq(open ? null : index)}
                      className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left"
                    >
                      <span className="text-base font-semibold text-foam">
                        {item.q}
                      </span>
                      <span
                        aria-hidden
                        className={`text-coral transition-transform ${open ? "rotate-45" : ""}`}
                      >
                        +
                      </span>
                    </button>
                    {open ? (
                      <p className="pb-4 text-base leading-relaxed text-mist-muted">
                        {item.a}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-5 pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] pt-12 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-xl">
          <p className="font-display text-2xl font-extrabold text-foam">Parvah</p>
          <p className="mt-2 text-sm text-mist-muted">
            Free random video chat for adults 18+.
          </p>

          <nav className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <a href="#faq" className="text-mist-muted transition-colors hover:text-foam">
              FAQ
            </a>
            <a href="#how" className="text-mist-muted transition-colors hover:text-foam">
              How it works
            </a>
            <a href="#" className="text-mist-muted transition-colors hover:text-foam">
              Safety & Rules
            </a>
            <a href="#" className="text-mist-muted transition-colors hover:text-foam">
              Privacy Policy
            </a>
            <a href="#" className="text-mist-muted transition-colors hover:text-foam">
              Terms of Service
            </a>
            <a href="#" className="text-mist-muted transition-colors hover:text-foam">
              Contact
            </a>
          </nav>

          <p className="mt-10 text-xs text-mist-muted">
            © {new Date().getFullYear()} Parvah. Adults only.
          </p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink/90 px-4 pt-3 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <a
          href="https://parvah.online"
          className="btn-primary flex min-h-12 w-full items-center justify-center rounded-2xl text-base font-bold text-foam"
        >
          Start Video Chat
        </a>
      </div>
    </div>
      )}
    </>
  );
}
