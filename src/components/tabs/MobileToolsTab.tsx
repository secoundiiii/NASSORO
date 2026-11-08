import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Vibrate,
  Battery,
  Wifi,
  Compass,
  Zap,
  HardDrive,
  Fingerprint,
  RotateCw,
  Sun
} from 'lucide-react';

export const MobileToolsTab: React.FC = () => {
  // Vibration
  const [vibrateSupported, setVibrateSupported] = useState(false);
  const [vibrateStatus, setVibrateStatus] = useState<string>('Ready to test');

  // Battery
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  // Network
  const [networkType, setNetworkType] = useState<string>('Unknown');
  const [downlink, setDownlink] = useState<number | null>(null);

  // Touch testing
  const [touchPoints, setTouchPoints] = useState<{ id: number; x: number; y: number }[]>([]);
  const touchCanvasRef = useRef<HTMLDivElement>(null);

  // Device Motion
  const [orientation, setOrientation] = useState<{ alpha: number; beta: number; gamma: number }>({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  // Storage
  const [storageEstimate, setStorageEstimate] = useState<{ usage: string; quota: string }>({
    usage: '0 MB',
    quota: '0 MB',
  });

  useEffect(() => {
    // Check vibration
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      setVibrateSupported(true);
    }

    // Check battery
    if (typeof navigator !== 'undefined' && 'getBattery' in (navigator as any)) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      });
    }

    // Check network
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    if (connection) {
      setNetworkType(connection.effectiveType || connection.type || '4G');
      setDownlink(connection.downlink || null);
    }

    // Check Storage Quota
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((est) => {
        const usageMB = ((est.usage || 0) / (1024 * 1024)).toFixed(1);
        const quotaMB = ((est.quota || 0) / (1024 * 1024)).toFixed(0);
        setStorageEstimate({ usage: `${usageMB} MB`, quota: `${quotaMB} MB` });
      });
    }

    // Orientation
    const handleOrientation = (e: DeviceOrientationEvent) => {
      setOrientation({
        alpha: Math.round(e.alpha || 0),
        beta: Math.round(e.beta || 0),
        gamma: Math.round(e.gamma || 0),
      });
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const triggerVibrate = (pattern: number | number[], name: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
      setVibrateStatus(`Vibrated: ${name}`);
      setTimeout(() => setVibrateStatus('Ready to test'), 2000);
    } else {
      setVibrateStatus('Vibration not supported on this browser/device');
    }
  };

  const handleTouchStartOrMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchCanvasRef.current) return;
    const rect = touchCanvasRef.current.getBoundingClientRect();
    const points = Array.from(e.touches).map((t) => ({
      id: t.identifier,
      x: Math.round(t.clientX - rect.left),
      y: Math.round(t.clientY - rect.top),
    }));
    setTouchPoints(points);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchCanvasRef.current) return;
    const rect = touchCanvasRef.current.getBoundingClientRect();
    const points = Array.from(e.touches).map((t) => ({
      id: t.identifier,
      x: Math.round(t.clientX - rect.left),
      y: Math.round(t.clientY - rect.top),
    }));
    setTouchPoints(points);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Android Hardware & Sensor Diagnostics
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Test vibration motors, multi-touch points, device orientation, and battery status directly on your Android phone.
        </p>
      </div>

      {/* Grid of tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Vibration Motor */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Vibrate className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Haptic Vibration</h3>
                <p className="text-[11px] text-slate-400">Android Taptic & Motor</p>
              </div>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                vibrateSupported
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {vibrateSupported ? 'Supported' : 'Standard API'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => triggerVibrate(150, 'Single Click')}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition cursor-pointer"
            >
              Single Tap
            </button>
            <button
              onClick={() => triggerVibrate([80, 50, 80], 'Double Pulse')}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition cursor-pointer"
            >
              Double Pulse
            </button>
            <button
              onClick={() => triggerVibrate([200, 100, 200, 100, 400], 'Heavy Alert')}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition cursor-pointer"
            >
              Heavy Alert
            </button>
            <button
              onClick={() =>
                triggerVibrate(
                  [100, 100, 100, 100, 100, 300, 300, 100, 300, 100, 300, 300, 100, 100, 100],
                  'SOS Pattern'
                )
              }
              className="py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-medium transition cursor-pointer"
            >
              SOS Signal
            </button>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg text-center font-mono">
            {vibrateStatus}
          </div>
        </div>

        {/* Card 2: Battery & Power */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Battery className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Battery & Power</h3>
                <p className="text-[11px] text-slate-400">Device Power State</p>
              </div>
            </div>
            {isCharging !== null && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" />
                {isCharging ? 'Charging' : 'Discharging'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="relative w-14 h-14 rounded-full border-4 border-emerald-500/30 flex items-center justify-center">
              <span className="text-base font-bold text-white">
                {batteryLevel !== null ? `${batteryLevel}%` : 'N/A'}
              </span>
            </div>
            <div className="text-xs space-y-1">
              <div className="text-slate-300">
                Status: <strong className="text-white">{isCharging ? 'Charging' : 'On Battery'}</strong>
              </div>
              <div className="text-slate-400 text-[11px]">
                API: navigator.getBattery()
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Network & Radio */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Radio & Network</h3>
                <p className="text-[11px] text-slate-400">Cellular / Wi-Fi</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-sky-500/20 text-sky-400 uppercase">
              {networkType}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Downlink Bandwidth</span>
              <span className="text-sm font-bold text-white mt-1 block">
                {downlink !== null ? `${downlink} Mbps` : 'High-speed'}
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Offline Support</span>
              <span className="text-sm font-bold text-emerald-400 mt-1 block">
                Service Worker Cached
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Gyroscope & Orientation */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Orientation Gyro</h3>
                <p className="text-[11px] text-slate-400">Tilt & Accelerometer</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Alpha (Z)</span>
              <span className="text-sm font-mono font-bold text-amber-400 mt-0.5 block">
                {orientation.alpha}°
              </span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Beta (X)</span>
              <span className="text-sm font-mono font-bold text-sky-400 mt-0.5 block">
                {orientation.beta}°
              </span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Gamma (Y)</span>
              <span className="text-sm font-mono font-bold text-emerald-400 mt-0.5 block">
                {orientation.gamma}°
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: Storage Quota */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Storage Quota</h3>
                <p className="text-[11px] text-slate-400">Offline App Storage</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Used: <strong className="text-white">{storageEstimate.usage}</strong></span>
              <span>Total Available: <strong className="text-white">{storageEstimate.quota}</strong></span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[8%]" />
            </div>
            <p className="text-[10px] text-slate-500">
              Persists in IndexedDB & Service Worker cache on device
            </p>
          </div>
        </div>

        {/* Card 6: Multi-touch screen test */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Multi-Touch Pad</h3>
                <p className="text-[11px] text-slate-400">
                  Touch with multiple fingers
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
              {touchPoints.length} Finger{touchPoints.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Interactive touch area */}
          <div
            ref={touchCanvasRef}
            onTouchStart={handleTouchStartOrMove}
            onTouchMove={handleTouchStartOrMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            className="w-full h-28 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center select-none touch-none cursor-pointer"
          >
            {touchPoints.length === 0 ? (
              <span className="text-xs text-slate-500">
                Touch this area on your phone
              </span>
            ) : (
              touchPoints.map((p, i) => (
                <div
                  key={p.id || i}
                  style={{ left: `${p.x}px`, top: `${p.y}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center text-[10px] font-bold text-white animate-pulse"
                >
                  {i + 1}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
