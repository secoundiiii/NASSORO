/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { ApkStudioTab } from './components/tabs/ApkStudioTab';
import { MobileToolsTab } from './components/tabs/MobileToolsTab';
import { OfflineNotesTab } from './components/tabs/OfflineNotesTab';
import { LogConsoleTab } from './components/tabs/LogConsoleTab';
import { ApkExportModal } from './components/ApkExportModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DeviceSimulator } from './components/DeviceSimulator';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('apk');
  const [activeDeviceView, setActiveDeviceView] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.origin);
    }
  }, []);

  const content = (
    <div className="flex-1 flex flex-col w-full min-h-full">
      <Header
        onOpenExportModal={() => setIsExportModalOpen(true)}
        activeDeviceView={activeDeviceView}
        onToggleDeviceView={() => setActiveDeviceView((prev) => !prev)}
      />

      <Navigation activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'apk' && (
          <ApkStudioTab
            onOpenExportModal={() => setIsExportModalOpen(true)}
            appUrl={appUrl}
          />
        )}
        {activeTab === 'tools' && <MobileToolsTab />}
        {activeTab === 'notes' && <OfflineNotesTab />}
        {activeTab === 'console' && <LogConsoleTab />}
      </main>

      <footer className="mt-auto border-t border-slate-900 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>DroidCraft • Android WebAPK & Debug APK Studio</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
            >
              Export Debug APK (.zip)
            </button>
            <span>•</span>
            <span className="text-slate-400">Target SDK: Android 14 (API 34)</span>
          </div>
        </div>
      </footer>

      <OfflineIndicator />

      <ApkExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        appUrl={appUrl}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DeviceSimulator
        activeDeviceView={activeDeviceView}
        onToggleDeviceView={() => setActiveDeviceView(false)}
      >
        {content}
      </DeviceSimulator>
    </div>
  );
}
