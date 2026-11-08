import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, CheckCircle2, Smartphone, ExternalLink, X } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'primary' | 'compact' | 'outline';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'primary',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as an installed standalone app, show subtle status badge
  if (isInstalled) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Installed App</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else {
      // If browser doesn't expose beforeinstallprompt (e.g. inside an iframe or on Safari/Firefox/Chrome manual)
      setShowGuideModal(true);
    }
  };

  const buttonStyle =
    variant === 'primary'
      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/25 border border-emerald-400/40'
      : variant === 'outline'
      ? 'bg-slate-900/80 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-medium'
      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-medium text-xs px-2.5 py-1.5';

  return (
    <>
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all active:scale-95 cursor-pointer ${buttonStyle} ${className}`}
        title="Install this app onto your Android phone or computer"
      >
        <Smartphone className="w-4 h-4 text-inherit shrink-0" />
        <span>{isInstallable ? 'Install App (1-Tap)' : 'Install on Android Phone'}</span>
      </button>

      {/* Manual Install Guide Modal (when beforeinstallprompt is suppressed, e.g. within iFrame or browser menu) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Install on Android Phone</h3>
                <p className="text-xs text-slate-400">Native WebAPK / Android Home Screen</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-4">
              Android automatically compiles this app into a signed <strong>WebAPK</strong> and places it in your App Drawer:
            </p>

            <div className="space-y-3 bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-sm">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-slate-300">
                  Open this link in <strong>Chrome, Samsung Internet, or Brave</strong> on your Android phone.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-slate-300">
                  Tap the <strong className="text-white">three dots menu (⋮)</strong> at the top right of Chrome.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-slate-300">
                  Tap <strong className="text-emerald-400">"Install app"</strong> or <strong className="text-emerald-400">"Add to Home screen"</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs shrink-0 mt-0.5">
                  4
                </span>
                <p className="text-slate-300">
                  Confirm <strong className="text-white">"Install"</strong>. Android will mint the APK and add it to your home screen!
                </p>
              </div>
            </div>

            {isIOS && (
              <div className="mt-4 p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300">
                <strong>iPhone/iPad:</strong> Tap Safari's <strong>Share</strong> icon and select <strong>"Add to Home Screen"</strong>.
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  window.open(window.location.href, '_blank');
                  setShowGuideModal(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 text-sm font-medium transition"
              >
                <ExternalLink className="w-4 h-4" />
                Open Direct URL
              </button>

              <button
                onClick={() => setShowGuideModal(false)}
                className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 text-sm font-semibold transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
