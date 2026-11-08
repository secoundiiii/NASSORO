import React, { useState } from 'react';
import { generateAndroidProjectZip } from '../utils/androidProjectGenerator';
import {
  Download,
  FileCode2,
  Terminal,
  FolderArchive,
  Check,
  Copy,
  X,
  ExternalLink,
  Smartphone,
  Cpu,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface ApkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [appName, setAppName] = useState('DroidCraft Mobile');
  const [packageName, setPackageName] = useState('com.droidcraft.app');
  const [versionName, setVersionName] = useState('1.0.0');
  const [targetUrl, setTargetUrl] = useState(appUrl || window.location.origin);
  const [activeCodeTab, setActiveCodeTab] = useState<'manifest' | 'gradle' | 'kotlin' | 'script'>('manifest');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateAndroidProjectZip({
        appName,
        packageName,
        versionName,
        versionCode: 1,
        appUrl: targetUrl,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${packageName.replace(/\./g, '_')}_debug_apk_project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const manifestPreview = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${appName}"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true"
        android:theme="@style/Theme.DroidCraft">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const gradlePreview = `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace '${packageName}'
    compileSdk 34

    defaultConfig {
        applicationId "${packageName}"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "${versionName}"
    }

    buildTypes {
        debug {
            debuggable true
            applicationIdSuffix ".debug"
            versionNameSuffix "-DEBUG"
            signingConfig signingConfigs.debug
        }
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.webkit:webkit:1.10.0'
}`;

  const kotlinPreview = `package ${packageName}

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebSettings
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val webView = WebView(this)
        setContentView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
        }
        webView.loadUrl("${targetUrl}")
    }
}`;

  const scriptPreview = `#!/bin/bash
# One-command compile for debug APK
chmod +x gradlew
./gradlew assembleDebug

echo "Debug APK built at: app/build/outputs/apk/debug/app-debug.apk"
adb install -r app/build/outputs/apk/debug/app-debug.apk`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Export Android Debug APK Project
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Gradle + Kotlin
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Generate ready-to-compile Android Studio source project with gradlew & assembleDebug
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Config Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                App Display Name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Android Package Identifier (App ID)
              </label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Version Name
              </label>
              <input
                type="text"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Web / Host Endpoint
              </label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-sm font-mono text-sky-400 focus:outline-none focus:border-emerald-500 truncate"
              />
            </div>
          </div>

          {/* Quick Terminal Guide */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Build \`app-debug.apk\` in 1 command after downloading:
              </span>
              <button
                onClick={() =>
                  copyToClipboard('./gradlew assembleDebug', 'buildCmd')
                }
                className="text-xs flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition"
              >
                {copiedCmd === 'buildCmd' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
            <pre className="font-mono text-xs bg-slate-900 p-2.5 rounded-lg text-emerald-400 overflow-x-auto">
              ./gradlew assembleDebug
            </pre>
            <p className="text-[11px] text-slate-400 mt-2">
              Outputs: <code className="text-slate-200">app/build/outputs/apk/debug/app-debug.apk</code>. Install directly to phone via <code className="text-sky-300">adb install -r app-debug.apk</code>.
            </p>
          </div>

          {/* Code Tabs */}
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
              <button
                onClick={() => setActiveCodeTab('manifest')}
                className={`text-xs px-3 py-1.5 rounded-lg transition font-medium ${
                  activeCodeTab === 'manifest'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                AndroidManifest.xml
              </button>
              <button
                onClick={() => setActiveCodeTab('gradle')}
                className={`text-xs px-3 py-1.5 rounded-lg transition font-medium ${
                  activeCodeTab === 'gradle'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                app/build.gradle
              </button>
              <button
                onClick={() => setActiveCodeTab('kotlin')}
                className={`text-xs px-3 py-1.5 rounded-lg transition font-medium ${
                  activeCodeTab === 'kotlin'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                MainActivity.kt
              </button>
              <button
                onClick={() => setActiveCodeTab('script')}
                className={`text-xs px-3 py-1.5 rounded-lg transition font-medium ${
                  activeCodeTab === 'script'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                build-apk.sh
              </button>
            </div>

            <div className="relative">
              <pre className="font-mono text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 max-h-48 overflow-y-auto overflow-x-auto leading-relaxed">
                {activeCodeTab === 'manifest' && manifestPreview}
                {activeCodeTab === 'gradle' && gradlePreview}
                {activeCodeTab === 'kotlin' && kotlinPreview}
                {activeCodeTab === 'script' && scriptPreview}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Includes gradlew, Gradle 8.4 wrapper, Kotlin 1.9, & GitHub Actions workflow</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={handleDownloadZip}
              disabled={isGenerating}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-5 py-2.5 text-sm font-bold shadow-lg shadow-emerald-500/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Packaging Zip...' : 'Download Android Studio Project (.zip)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
