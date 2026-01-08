
// Main App Component
import React, { useState } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import Ideas from './screens/Ideas';
import Calendar from './screens/Calendar';
import Editor from './screens/Editor';

const App: React.FC = () => {
  console.log('App: Rendering component');
  const [currentView, setCurrentView] = useState<View>(View.ONBOARDING);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case View.ONBOARDING:
        return <Onboarding onComplete={() => setCurrentView(View.DASHBOARD)} />;
      case View.DASHBOARD:
        return <Dashboard onNavigate={(v) => setCurrentView(v)} />;
      case View.IDEAS:
        return <Ideas />;
      case View.CALENDAR:
        return <Calendar />;
      case View.EDITOR:
        return <Editor />;
      default:
        return <Dashboard onNavigate={(v) => setCurrentView(v)} />;
    }
  };

  const showSidebar = currentView !== View.ONBOARDING && currentView !== View.EDITOR;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {showSidebar && (
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      <main className={`flex-1 flex flex-col h-full overflow-hidden bg-[#f6f6f8]`}>
        {renderView()}
      </main>
    </div>
  );
};

export default App;
