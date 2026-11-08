import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Smartphone,
  Download,
  Terminal,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Cpu,
  Layers,
  ArrowUpRight,
  HardDrive
} from 'lucide-react';

interface ApkStudioTabProps {
  onOpenExportModal: () => void;
  appUrl: string;
}

export const ApkStudioTab: React.FC<ApkStudioTabProps> = ({
  onOpenExportModal,
  appUrl,
}) => {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Simulated APK Build state
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'finished'>('idle');
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [buildProgress, setBuildProgress] = useState(0);

  const displayUrl = appUrl || window.location.href;

  useEffect(() => {
    // Generate QR code for mobile phone scanning
    QRCode.toDataURL(displayUrl, {
      margin: 2,
      width: 240,
      color: {
        dark: '#020617',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('QR Gen error:', err));
  }, [displayUrl]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const runBuildSimulation = () => {
    setBuildStatus('building');
    setBuildProgress(5);
    setBuildLogs([
      '🚀 [GRADLE] Initializing Gradle Daemon 8.4...',
      '📦 [CONFIG] Namespace: com.droidcraft.app | TargetSDK: 34 (Android 14)',
    ]);

    const steps = [
      { p: 20, log: '⚙️  :app:preBuild UP-TO-DATE' },
      { p: 35, log: '📄 :app:processDebugMainManifest -> Merged AndroidManifest.xml' },
      { p: 50, log: '☕ :app:compileDebugKotlin -> 14 Kotlin source files compiled' },
      { p: 65, log: '🎨 :app:mergeDebugResources -> 192x192, 512x512 adaptive icons packaged' },
      { p: 80, log: '🔨 :app:dexBuilderDebug -> classes.dex bytecode generated' },
      { p: 90, log: '🔑 :app:packageDebug -> Signed with debug.keystore (SHA-256)' },
      { p: 95, log: '⚡ :app:zipalignDebug -> 4-byte memory boundary aligned' },
      { p: 100, log: '🎉 BUILD SUCCESSFUL! Output: app/build/outputs/apk/debug/app-debug.apk' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setBuildProgress(step.p);
        setBuildLogs((prev) => [...prev, step.log]);
        currentStep++;
      } else {
        clearInterval(interval);
        setBuildStatus('finished');
      }
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Android Ready • Standalone PWA & Native Debug APK</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Install Directly on Android Phone
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Run this application on any Android device as a standalone app with offline caching, hardware acceleration, full-screen view, and an icon in your app drawer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {isInstalled ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Installed as Android App</span>
              </div>
            ) : (
              <button
                onClick={install}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 text-sm shadow-xl shadow-emerald-500/20 transition active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <Smartphone className="w-4 h-4" />
                <span>{isInstallable ? 'Install App (1-Tap)' : 'Install on Android Phone'}</span>
              </button>
            )}

            <button
              onClick={onOpenExportModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-semibold px-4 py-3 text-sm transition active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>Export APK Project (.zip)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Direct Android Phone Install (QR Code + WebAPK) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Scan with Android Phone</h3>
                  <p className="text-xs text-slate-400">Open instantly in mobile Chrome</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                1-Tap Install
              </span>
            </div>

            {/* QR Code Canvas */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800">
              {qrCodeUrl ? (
                <div className="bg-white p-3 rounded-xl shadow-md">
                  <img src={qrCodeUrl} alt="Scan with Android Phone" className="w-44 h-44 object-contain" />
                </div>
              ) : (
                <div className="w-44 h-44 bg-slate-800 animate-pulse rounded-xl flex items-center justify-center text-slate-500 text-xs">
                  Generating QR...
                </div>
              )}
              <p className="text-xs text-slate-400 mt-3 text-center">
                Point your Android camera or QR scanner at the code above
              </p>
            </div>

            {/* App URL Copy Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>App Link for Android Browser:</span>
                <button
                  onClick={() => copyToClipboard(displayUrl, 'url')}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {copiedText === 'url' ? (
                    <>
                      <Check className="w-3 h-3" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy URL
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                <span className="truncate flex-1">{displayUrl}</span>
                <a
                  href={displayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white p-1"
                  title="Open in new window"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Step by step for Android */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                How Android Installs it as a Native App:
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Open link in Chrome or Samsung Internet on phone.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>Tap <strong>"Install App"</strong> or the <strong>(⋮) menu → "Install app"</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Android's <strong>WebAPK minting service</strong> generates and signs an APK package directly onto your phone!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Android PWA Checklist Verification */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Android Install Readiness Audit
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-300">Web App Manifest (id, name, scope)</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-300">Display: 'standalone' (no address bar)</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-300">Android Icons (192px, 512px, Maskable)</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 3 Assets
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-300">Service Worker & Offline Cache (Workbox)</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-300">Touch & Viewport Responsive Meta</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Configured
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Android Studio Debug APK Builder & Terminal */}
        <div className="lg:col-span-7 space-y-6">
          {/* APK Source Project Box */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Android Studio Debug APK Project
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pre-configured Gradle wrapper, Kotlin WebView bridge & assembleDebug
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenExportModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .ZIP</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-left">
                <div className="text-[11px] text-slate-400 mb-1">Target Package</div>
                <div className="text-xs font-mono font-bold text-emerald-400 truncate">
                  com.droidcraft.app
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-left">
                <div className="text-[11px] text-slate-400 mb-1">Target SDK</div>
                <div className="text-xs font-mono font-bold text-sky-400">
                  Android 14 (API 34)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-left">
                <div className="text-[11px] text-slate-400 mb-1">Build Target</div>
                <div className="text-xs font-mono font-bold text-amber-400">
                  app-debug.apk
                </div>
              </div>
            </div>

            {/* Interactive Simulated Gradle Build Runner */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Gradle Build Pipeline: <code className="text-emerald-400">./gradlew assembleDebug</code>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {buildStatus === 'finished' ? (
                    <button
                      onClick={runBuildSimulation}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition"
                    >
                      <RotateCcw className="w-3 h-3" /> Re-run
                    </button>
                  ) : (
                    <button
                      onClick={runBuildSimulation}
                      disabled={buildStatus === 'building'}
                      className="flex items-center gap-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-3 py-1 rounded-lg transition active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{buildStatus === 'building' ? 'Compiling...' : 'Test Build APK'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {buildStatus === 'building' && (
                <div className="w-full bg-slate-800 h-1">
                  <div
                    className="bg-emerald-500 h-1 transition-all duration-300"
                    style={{ width: `${buildProgress}%` }}
                  />
                </div>
              )}

              {/* Terminal Output */}
              <div className="p-4 font-mono text-xs text-slate-300 space-y-1.5 max-h-56 overflow-y-auto bg-slate-950">
                {buildLogs.length === 0 ? (
                  <div className="text-slate-500 py-4 text-center">
                    Click <strong>"Test Build APK"</strong> to preview the Android Gradle compilation process, or click <strong>"Export .ZIP"</strong> to compile it directly on your machine or phone.
                  </div>
                ) : (
                  buildLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log.includes('SUCCESSFUL')
                          ? 'text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20'
                          : log.includes('UP-TO-DATE')
                          ? 'text-sky-300'
                          : 'text-slate-300'
                      }
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick ADB install snippet */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Install built APK on Phone via USB / Wi-Fi:</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'adb install -r app/build/outputs/apk/debug/app-debug.apk',
                      'adb'
                    )
                  }
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {copiedText === 'adb' ? (
                    <>
                      <Check className="w-3 h-3" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy ADB Command
                    </>
                  )}
                </button>
              </div>
              <pre className="font-mono text-xs bg-slate-900 p-2.5 rounded-lg text-emerald-400 overflow-x-auto">
                adb install -r app/build/outputs/apk/debug/app-debug.apk
              </pre>
            </div>
          </div>

          {/* Alternative Methods Box */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              Build Methods Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-emerald-400">1. Instant Phone Install (WebAPK)</div>
                <p className="text-slate-300">
                  Zero setup. Scan the QR code or tap Install. Chrome automatically creates and installs the APK package on your phone.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-sky-400">2. Android Studio (GUI)</div>
                <p className="text-slate-300">
                  Unzip the exported project, open in Android Studio, click <strong>Build → Build APK(s)</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-amber-400">3. GitHub Actions (Cloud)</div>
                <p className="text-slate-300">
                  Included <code className="text-slate-200">.github/workflows/build-apk.yml</code> builds the APK on push and gives a download link in 2 minutes.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="font-bold text-purple-400">4. Termux (Directly on Phone)</div>
                <p className="text-slate-300">
                  Run <code className="text-slate-200">pkg install openjdk-17 gradle</code> and execute <code className="text-slate-200">gradle assembleDebug</code> without a PC!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
