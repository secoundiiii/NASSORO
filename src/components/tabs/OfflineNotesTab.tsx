import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Save,
  Tag,
  Clock,
  Sparkles,
  CloudOff
} from 'lucide-react';

interface NoteItem {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  category: 'Android' | 'Dev' | 'Ideas' | 'General';
  updatedAt: string;
}

const STORAGE_KEY = 'droidcraft_offline_notes_v1';

export const OfflineNotesTab: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Android' | 'Dev' | 'Ideas' | 'General'>('Android');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setNotes(JSON.parse(saved));
      } else {
        // Sample starter notes
        const starter: NoteItem[] = [
          {
            id: '1',
            title: 'Android APK Setup Checklist',
            content:
              '1. Install via Chrome WebAPK for instant native testing.\n2. Enable Developer Options on phone (tap Build number 7 times).\n3. Turn on USB Debugging.\n4. Run ./gradlew assembleDebug or adb install -r app-debug.apk.',
            completed: false,
            category: 'Android',
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: '2',
            title: 'Offline Storage Verification',
            content:
              'This note is stored 100% locally on your phone using localStorage. Even in Airplane Mode without any Wi-Fi or cellular connection, your data is completely accessible!',
            completed: true,
            category: 'Dev',
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
        setNotes(starter);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(starter));
      }
    } catch (e) {
      console.error('Error loading notes:', e);
    }
  }, []);

  const saveToStorage = (updated: NoteItem[]) => {
    setNotes(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Storage error:', e);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newNote: NoteItem = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      completed: false,
      category,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    saveToStorage([newNote, ...notes]);
    setTitle('');
    setContent('');
  };

  const toggleComplete = (id: string) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, completed: !n.completed } : n
    );
    saveToStorage(updated);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveToStorage(updated);
    if (selectedNoteId === id) setSelectedNoteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Offline Mobile Notes & Local Storage
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Data is persisted on device memory and works with zero network connection.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium self-start sm:self-auto">
          <CloudOff className="w-3.5 h-3.5" />
          <span>Local Storage Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Note Creator Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Create Local Note
          </h3>

          <form onSubmit={handleAddNote} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Note Title or Task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <textarea
                rows={4}
                placeholder="Write notes, code snippets, or checklists..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="Android">📱 Android</option>
                <option value="Dev">💻 Dev</option>
                <option value="Ideas">💡 Ideas</option>
                <option value="General">📝 General</option>
              </select>

              <button
                type="submit"
                disabled={!title.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Offline</span>
              </button>
            </div>
          </form>
        </div>

        {/* Notes List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Saved Records ({notes.length})</span>
            <span>Auto-saved on device</span>
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-500 text-sm">
              No notes saved yet. Add one above!
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl border transition-all ${
                    note.completed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => toggleComplete(note.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                    >
                      {note.completed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px]">
                          {note.category}
                        </span>
                        <h4
                          className={`text-sm font-semibold truncate ${
                            note.completed ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {note.title}
                        </h4>
                      </div>

                      {note.content && (
                        <p className="text-xs text-slate-300 whitespace-pre-line mt-1 line-clamp-3">
                          {note.content}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {note.updatedAt}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
