import React, { useState, useEffect } from 'react';
import { Smartphone, RotateCw, Wifi, Battery, Signal, Maximize2, Minimize2 } from 'lucide-react';

interface DeviceSimulatorProps {
  children: React.ReactNode;
  activeDeviceView: boolean;
  onToggleDeviceView: () => void;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  children,
  activeDeviceView,
  onToggleDeviceView,
}) => {
  const [currentTime, setCurrentTime] = useState('12:00');
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  if (!activeDeviceView) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 px-2 min-h-screen">
      {/* Simulator Control Toolbar */}
      <div className="flex items-center gap-3 mb-6 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Pixel 9 Pro Simulator</span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <button
          onClick={() => setIsLandscape(!isLandscape)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition"
          title="Rotate device"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
        </button>

        <div className="h-4 w-px bg-slate-800" />

        <button
          onClick={onToggleDeviceView}
          className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 transition"
          title="Exit phone frame"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Exit Frame View</span>
        </button>
      </div>

      {/* Realistic Android Phone Bezel Frame */}
      <div
        className={`relative transition-all duration-300 bg-slate-900 border-[10px] border-slate-800 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ${
          isLandscape ? 'w-[780px] h-[400px]' : 'w-[390px] h-[780px] max-w-[95vw]'
        }`}
      >
        {/* Android Punch Hole Camera */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border border-slate-700/80 z-40 pointer-events-none" />

        {/* Android Native Status Bar */}
        <div className="w-full h-8 px-6 bg-slate-950 flex items-center justify-between text-[11px] font-semibold text-slate-300 select-none z-30 shrink-0">
          <span>{currentTime}</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <div className="flex items-center gap-1 text-[10px]">
              <span>98%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            </div>
          </div>
        </div>

        {/* Screen Viewport with internal scrolling */}
        <div className="flex-1 overflow-y-auto bg-slate-950 flex flex-col relative">
          {children}
        </div>

        {/* Android Home Navigation Gesture Pill */}
        <div className="w-full h-5 bg-slate-950 flex items-center justify-center select-none z-30 shrink-0 pb-1">
          <div className="w-28 h-1 rounded-full bg-slate-600" />
        </div>
      </div>
    </div>
  );
};
