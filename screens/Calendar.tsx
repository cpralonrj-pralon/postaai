
import React from 'react';

const Calendar: React.FC = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

  const events = [
    { day: 2, platform: 'Instagram', title: 'Bastidores do setup', time: '18:00', type: 'Reels', status: 'check_circle' },
    { day: 4, platform: 'TikTok', title: 'Trend da semana', time: '15:00', type: 'TikTok', status: 'schedule' },
    { day: 8, platform: 'Instagram', title: 'Post Collab c/ Marca', time: '19:30', type: 'Instagram', status: 'schedule', isToday: true },
    { day: 10, platform: 'TikTok', title: 'Review Produto X', time: '12:00', type: 'TikTok', status: 'schedule' },
  ];

  const getPlatformStyle = (p: string) => {
    switch (p) {
      case 'Instagram': return 'bg-pink-50 border-pink-500 text-pink-700';
      case 'TikTok': return 'bg-cyan-50 border-cyan-500 text-cyan-700';
      case 'YouTube': return 'bg-red-50 border-red-500 text-red-700';
      default: return 'bg-slate-50 border-slate-500 text-slate-700';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
      <div className="max-w-[1200px] mx-auto flex flex-col h-full gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Agenda de Conteúdo</h2>
            <div className="flex items-center gap-2 text-slate-500">
              <button className="p-1 hover:bg-slate-100 rounded"><span className="material-symbols-outlined text-sm">arrow_back_ios</span></button>
              <span className="text-lg font-medium">Outubro 2023</span>
              <button className="p-1 hover:bg-slate-100 rounded"><span className="material-symbols-outlined text-sm">arrow_forward_ios</span></button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
              <button className="px-3 py-1.5 rounded-md text-sm font-medium bg-slate-100 text-slate-900 shadow-sm transition-all">Mês</button>
              <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-50">Semana</button>
              <button className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-50">Dia</button>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-pink-200 bg-pink-50 text-pink-700 text-sm font-medium"><span className="w-2 h-2 rounded-full bg-pink-500"></span>Instagram</button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 text-sm font-medium"><span className="w-2 h-2 rounded-full bg-cyan-500"></span>TikTok</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col flex-1 min-h-[600px] overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
            {weekDays.map(d => (
              <div key={d} className="p-3 text-center text-xs font-semibold uppercase text-slate-500">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-5 flex-1 divide-x divide-y divide-slate-100 border-l">
            {/* Empty slots for spacing if month starts on different day */}
            <div className="min-h-[120px] bg-slate-50/30"></div>
            <div className="min-h-[120px] bg-slate-50/30"></div>
            <div className="min-h-[120px] bg-slate-50/30"></div>
            
            {days.map(day => {
              const dayEvents = events.filter(e => e.day === day);
              return (
                <div key={day} className={`min-h-[120px] p-2 relative group hover:bg-slate-50 transition-colors ${dayEvents.some(e => e.isToday) ? 'bg-blue-50/20' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium p-1 w-6 h-6 flex items-center justify-center rounded-full ${dayEvents.some(e => e.isToday) ? 'bg-primary text-white' : 'text-slate-500'}`}>
                      {day}
                    </span>
                    {dayEvents.some(e => e.isToday) && <span className="text-[10px] font-bold text-primary uppercase">Hoje</span>}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((ev, i) => (
                      <div key={i} className={`p-1.5 rounded-md border-l-4 shadow-sm text-left ${getPlatformStyle(ev.platform)}`}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[8px] font-bold uppercase">{ev.platform}</span>
                          <span className="material-symbols-outlined text-[12px]">{ev.status}</span>
                        </div>
                        <p className="text-[10px] font-semibold truncate">{ev.title}</p>
                        <span className="text-[8px] font-medium opacity-70 block">{ev.time}</span>
                      </div>
                    ))}
                    {day === 3 && (
                      <div className="mt-2 border border-dashed border-primary/40 bg-primary/5 rounded-md p-1.5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                        <p className="text-[8px] font-semibold text-primary">Sugerido: TikTok</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
