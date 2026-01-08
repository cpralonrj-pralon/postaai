
import React from 'react';
import { View, ScheduledContent } from '../types';

interface DashboardProps {
  onNavigate: (v: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Conteúdos Planejados', value: 8, trend: '+20%', icon: 'edit_calendar', color: 'text-primary' },
    { label: 'Pendentes', value: 3, trend: 'Aguardando revisão', icon: 'pending', color: 'text-orange-400' },
    { label: 'Publicados este mês', value: 12, trend: '+5%', icon: 'check_circle', color: 'text-green-500' },
  ];

  const content: ScheduledContent[] = [
    { id: '1', title: '5 Dicas de Produtividade em 2024', type: 'Video curto (Reels/TikTok)', platform: 'Instagram', date: 'Hoje, 18:00', status: 'Planejado' },
    { id: '2', title: 'Como comecei no mundo SaaS', type: 'Thread', platform: 'X', date: 'Amanhã, 10:00', status: 'Pendente' },
    { id: '3', title: 'Tutorial Completo: Figma para Devs', type: 'Video Longo', platform: 'YouTube', date: '15 Out, 14:00', status: 'Rascunho' },
    { id: '4', title: 'Review: Microfone Novo', type: 'Stories', platform: 'Instagram', date: 'Ontem, 09:30', status: 'Publicado' },
  ];

  const getPlatformIcon = (p: string) => {
    switch (p) {
      case 'Instagram': return <div className="size-6 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">IG</div>;
      case 'X': return <div className="size-6 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold shadow-sm">X</div>;
      case 'YouTube': return <div className="size-6 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">YT</div>;
      default: return null;
    }
  };

  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'Planejado': return 'bg-blue-100 text-blue-800';
      case 'Pendente': return 'bg-orange-100 text-orange-800';
      case 'Publicado': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
      <div className="max-w-[1100px] mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Olá, Creator! 👋</h1>
            <p className="text-slate-500 text-base">Aqui está o resumo da sua semana produtiva.</p>
          </div>
          <button 
            onClick={() => onNavigate(View.EDITOR)}
            className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span className="text-sm font-bold">Novo Conteúdo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map(s => (
            <div key={s.label} className="flex flex-col gap-2 rounded-2xl p-6 bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm font-medium">{s.label}</p>
                <div className={`size-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors`}>
                  <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                </div>
              </div>
              <div className="flex items-end gap-2 mt-2">
                <p className="text-slate-900 tracking-tight text-3xl font-black leading-none">{s.value}</p>
                <span className={`text-xs font-bold mb-1 flex items-center px-2 py-0.5 rounded-full ${s.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {s.trend.startsWith('+') && <span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>}
                  {s.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10"></div>
          <div className="flex flex-col gap-4 flex-1 relative z-10">
            <div className="space-y-2">
              <h2 className="text-slate-900 tracking-tight text-xl font-bold">Ações Rápidas</h2>
              <p className="text-slate-500 text-sm max-w-[480px]">Não deixe o ritmo cair. Use ferramentas de IA para destravar sua criatividade agora mesmo.</p>
            </div>
            <button 
              onClick={() => onNavigate(View.IDEAS)}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-all w-fit shadow-md shadow-blue-500/20"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Gerar Novas Ideias</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1 relative z-10">
            <div className="flex flex-col justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-primary/50 cursor-pointer transition-all group hover:bg-white hover:shadow-md">
              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform origin-left">lightbulb</span>
              <div>
                <h3 className="text-slate-900 text-sm font-bold">Brainstorm</h3>
                <p className="text-slate-500 text-xs">Lista de 10 ideias</p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-primary/50 cursor-pointer transition-all group hover:bg-white hover:shadow-md">
              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform origin-left">edit_note</span>
              <div>
                <h3 className="text-slate-900 text-sm font-bold">Roteiro</h3>
                <p className="text-slate-500 text-xs">Criar script curto</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">Próximos Conteúdos</h2>
            <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              Ver todos
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 text-xs font-bold tracking-widest text-slate-400 uppercase">Conteúdo</th>
                    <th className="p-4 text-xs font-bold tracking-widest text-slate-400 uppercase">Plataforma</th>
                    <th className="p-4 text-xs font-bold tracking-widest text-slate-400 uppercase">Data</th>
                    <th className="p-4 text-xs font-bold tracking-widest text-slate-400 uppercase">Status</th>
                    <th className="p-4 text-xs font-bold tracking-widest text-slate-400 uppercase text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {content.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <p className={`font-bold text-slate-900 text-sm ${c.status === 'Publicado' ? 'line-through decoration-slate-400' : ''}`}>{c.title}</p>
                          <p className="text-xs text-slate-400 font-medium">{c.type}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(c.platform)}
                          <span className="text-sm font-bold text-slate-700">{c.platform}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600 font-bold">{c.date}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                          <span className="material-symbols-outlined text-[20px]">{c.status === 'Publicado' ? 'visibility' : 'edit'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
              <button onClick={() => onNavigate(View.CALENDAR)} className="text-xs font-black text-slate-400 hover:text-primary uppercase tracking-[0.2em] transition-colors">
                Ver Agenda Completa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
