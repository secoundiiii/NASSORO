import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Trash2,
  Copy,
  Check,
  Info,
  AlertTriangle,
  AlertOctagon,
  RefreshCw,
  Smartphone
} from 'lucide-react';

interface LogEntry {
  id: string;
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  time: string;
}

export const LogConsoleTab: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Intercept window console logs
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    const addLog = (type: LogEntry['type'], args: any[]) => {
      const msg = args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ');

      setLogs((prev) => [
        {
          id: Math.random().toString(),
          type,
          message: msg,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        },
        ...prev.slice(0, 100),
      ]);
    };

    console.log = (...args) => {
      originalLog(...args);
      addLog('log', args);
    };
    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args);
    };
    console.error = (...args) => {
      originalError(...args);
      addLog('error', args);
    };
    console.info = (...args) => {
      originalInfo(...args);
      addLog('info', args);
    };

    // Global error listener
    const handleError = (e: ErrorEvent) => {
      addLog('error', [`Uncaught Error: ${e.message} at ${e.filename}:${e.lineno}`]);
    };
    window.addEventListener('error', handleError);

    // Initial system logs
    const info: { [key: string]: string } = {
      'User Agent': navigator.userAgent,
      'Screen Size': `${window.screen.width} x ${window.screen.height} (DPR: ${window.devicePixelRatio})`,
      'Viewport': `${window.innerWidth} x ${window.innerHeight}`,
      'Platform': navigator.platform || 'Unknown',
      'Standalone Mode': String(
        window.matchMedia('(display-mode: standalone)').matches ||
          (navigator as any).standalone === true
      ),
      'Online': String(navigator.onLine),
    };
    setDeviceInfo(info);

    addLog('info', [
      'DroidCraft Mobile Console initialized.',
      `Display: ${window.screen.width}x${window.screen.height} @ ${window.devicePixelRatio}x`,
      `Standalone: ${info['Standalone Mode']}`,
    ]);

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
      window.removeEventListener('error', handleError);
    };
  }, []);

  const clearLogs = () => setLogs([]);

  const copyLogs = () => {
    const text = logs.map((l) => `[${l.time}] [${l.type.toUpperCase()}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerTestLog = () => {
    console.log('Test Android event triggered at ' + new Date().toISOString());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            Android In-App Debug Console
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time runtime logs, device parameters, and exception tracking for mobile testing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerTestLog}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            Emit Test Log
          </button>
          <button
            onClick={copyLogs}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy
              </>
            )}
          </button>
          <button
            onClick={clearLogs}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-xs font-semibold text-slate-400 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Device Info Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {Object.entries(deviceInfo).map(([key, value]) => (
          <div key={key} className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">{key}</div>
            <div className="font-mono text-xs text-slate-200 truncate mt-0.5" title={value}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Logs Terminal */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="ml-2 font-mono text-[11px] text-slate-400">Log Stream ({logs.length})</span>
          </div>
          <span className="text-[11px] text-slate-500">Auto-captures mobile errors</span>
        </div>

        <div className="p-4 font-mono text-xs space-y-2 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-slate-600 text-center py-8">
              No logs emitted yet. Interact with the app or click "Emit Test Log".
            </div>
          ) : (
            logs.map((log) => {
              const color =
                log.type === 'error'
                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                  : log.type === 'warn'
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  : log.type === 'info'
                  ? 'text-sky-300 bg-sky-500/10 border-sky-500/20'
                  : 'text-slate-300 bg-slate-900/60 border-slate-800';

              return (
                <div
                  key={log.id}
                  className={`p-2.5 rounded-lg border flex items-start gap-2.5 leading-relaxed break-all ${color}`}
                >
                  <span className="text-[10px] text-slate-500 shrink-0 mt-0.5">{log.time}</span>
                  <span className="uppercase text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 bg-slate-950/80">
                    {log.type}
                  </span>
                  <span className="flex-1">{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
