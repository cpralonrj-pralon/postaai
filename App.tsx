
// Main App Component
import React, { useState } from 'react';
import { View, ContentIdea } from './types';
import Sidebar from './components/Sidebar';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import Ideas from './screens/Ideas';
import Calendar from './screens/Calendar';
import Editor from './screens/Editor';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './screens/Login';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>(View.ONBOARDING);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editDraft, setEditDraft] = useState<ContentIdea | undefined>(undefined);

  // API Key Check - MOVED TO TOP to avoid Hook Error
  const [missingKeys, setMissingKeys] = useState<string[]>([]);

  React.useEffect(() => {
    const keys = [];
    const env = (import.meta as any).env || {};

    // Check Gemini Key
    if (!env.VITE_GEMINI_API_KEY && !env.GEMINI_API_KEY) {
      keys.push('VITE_GEMINI_API_KEY');
    }

    // Check Kie Key
    if (!env.VITE_KIE_API_KEY && !env.KIE_API_KEY) {
      keys.push('VITE_KIE_API_KEY');
    }

    setMissingKeys(keys);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case View.ONBOARDING:
        return <Onboarding onComplete={() => setCurrentView(View.DASHBOARD)} />;
      case View.DASHBOARD:
        return <Dashboard onNavigate={(v) => setCurrentView(v)} />;
      case View.IDEAS:
        return <Ideas onEdit={(idea) => { setEditDraft(idea); setCurrentView(View.EDITOR); }} />;
      case View.CALENDAR:
        return <Calendar />;
      case View.EDITOR:
        return <Editor initialData={editDraft} />;
      default:
        return <Dashboard onNavigate={(v) => setCurrentView(v)} />;
    }
  };

  const showSidebar = currentView !== View.ONBOARDING && currentView !== View.EDITOR;

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* API Key Alert */}
      {missingKeys.length > 0 && (
        <div className="absolute top-0 left-0 right-0 z-[100] bg-orange-500/10 backdrop-blur-md border-b border-orange-500/20 px-4 py-3 text-orange-700 text-sm font-bold flex items-center justify-between animate-in slide-in-from-top">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined icon-filled">warning</span>
            <span>
              Chaves de API não encontradas: {missingKeys.join(', ')}.
              <span className="font-normal opacity-80 ml-1">Adicione-as ao arquivo .env.local para desbloquear a IA.</span>
            </span>
          </div>
          <button
            onClick={() => setMissingKeys([])}
            className="p-1 hover:bg-orange-500/10 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {showSidebar && (
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      <main className={`flex-1 flex flex-col h-full overflow-hidden bg-[#f6f6f8] relative pt-0`}>
        {renderView()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
