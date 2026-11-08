import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import {
  Smartphone,
  Download,
  Wifi,
  WifiOff,
  Maximize2,
  Minimize2,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  onOpenExportModal: () => void;
  activeDeviceView: boolean;
  onToggleDeviceView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExportModal,
  activeDeviceView,
  onToggleDeviceView,
}) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                DroidCraft
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                APK & PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Android Native WebAPK & Debug APK Studio
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online badge */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isOnline
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* Toggle Device Frame */}
          <button
            onClick={onToggleDeviceView}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              activeDeviceView
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
            title="Toggle between phone frame simulator and full viewport"
          >
            {activeDeviceView ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Full View</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Phone Frame</span>
              </>
            )}
          </button>

          {/* Export APK modal button */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition cursor-pointer"
            title="Export Android Studio Debug APK project zip"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export APK</span>
          </button>

          {/* Install Button (PWA / WebAPK) */}
          <PWAInstallButton variant="primary" />
        </div>
      </div>
    </header>
  );
};
