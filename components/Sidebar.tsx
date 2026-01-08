
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: 'dashboard' },
    { id: View.CALENDAR, label: 'Calendário', icon: 'calendar_month' },
    { id: View.IDEAS, label: 'Ideias Geradas', icon: 'lightbulb' },
    { id: View.EDITOR, label: 'Criar Post', icon: 'edit_square' },
    { id: View.DASHBOARD, label: 'Analytics', icon: 'bar_chart' },
    { id: View.DASHBOARD, label: 'Configurações', icon: 'settings' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full hidden lg:flex">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-6">
          <div className="flex gap-3 items-center px-2 py-2">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <span className="material-symbols-outlined icon-filled">auto_awesome_mosaic</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-[#111118] text-base font-bold leading-normal truncate">CreatorSaaS</h1>
              <p className="text-[#616189] text-xs font-medium leading-normal">Plano Pro</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1 mt-4">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  currentView === item.id 
                    ? 'bg-[#1313ec]/10 text-[#1313ec]' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={`material-symbols-outlined ${currentView === item.id ? 'icon-filled' : ''}`}>
                  {item.icon}
                </span>
                <p className={`text-sm ${currentView === item.id ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </p>
              </button>
            ))}
          </nav>
        </div>

        <div className="px-3 py-2 border-t border-slate-100">
          <button className="flex items-center gap-3 w-full text-slate-500 hover:text-red-600 transition-colors py-2">
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
