import React from 'react';
import {
  Smartphone,
  Activity,
  FileText,
  Terminal,
  Download
} from 'lucide-react';

export type TabType = 'apk' | 'tools' | 'notes' | 'console';

interface NavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    {
      id: 'apk' as TabType,
      label: 'APK & Install',
      shortLabel: 'APK Hub',
      icon: Smartphone,
    },
    {
      id: 'tools' as TabType,
      label: 'Diagnostics',
      shortLabel: 'Hardware',
      icon: Activity,
    },
    {
      id: 'notes' as TabType,
      label: 'Offline Notes',
      shortLabel: 'Notes',
      icon: FileText,
    },
    {
      id: 'console' as TabType,
      label: 'Debug Console',
      shortLabel: 'Logs',
      icon: Terminal,
    },
  ];

  return (
    <nav className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-2 sticky top-[57px] z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-start gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
