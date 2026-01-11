import React, { useState, useEffect } from 'react';
import { View, ScheduledContent } from '../types';
import { supabaseService } from '../services/supabaseService';
import { generateBrainstorm, generateQuickScript } from '../geminiService';

interface DashboardProps {
  onNavigate: (v: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState([
    { label: 'Conteúdos Planejados', value: 0, trend: '+20%', icon: 'edit_calendar', color: 'text-primary' },
    { label: 'Pendentes', value: 0, trend: 'Aguardando revisão', icon: 'pending', color: 'text-orange-400' },
    { label: 'Publicados este mês', value: 0, trend: '+5%', icon: 'check_circle', color: 'text-green-500' },
  ]);

  const [content, setContent] = useState<ScheduledContent[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Action State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<string | string[]>('');
  const [actionLoading, setActionLoading] = useState(false);

  // ... (loadData logic remains same)
  // Carregar dados do banco
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // ... (existing loadData logic)
    try {
      setLoading(true);

      // Buscar estatísticas
      const dbStats = await supabaseService.getStats();

      // Atualizar stats
      setStats([
        {
          label: 'Conteúdos Planejados',
          value: dbStats.planned,
          trend: dbStats.planned > 0 ? `+${Math.round((dbStats.planned / (dbStats.totalScheduled || 1)) * 100)}%` : '0%',
          icon: 'edit_calendar',
          color: 'text-primary'
        },
        {
          label: 'Pendentes',
          value: dbStats.pending,
          trend: dbStats.pending > 0 ? 'Aguardando revisão' : 'Nenhum pendente',
          icon: 'pending',
          color: 'text-orange-400'
        },
        {
          label: 'Publicados este mês',
          value: dbStats.published,
          trend: dbStats.published > 0 ? `+${dbStats.published}` : '0',
          icon: 'check_circle',
          color: 'text-green-500'
        },
      ]);

      // Buscar conteúdos agendados
      const scheduledContent = await supabaseService.getAllScheduledContent();

      // Ordenar por data (mais recentes primeiro)
      const sortedContent = scheduledContent.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setContent(sortedContent.slice(0, 4)); // Mostrar apenas os 4 mais recentes
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (p: string) => {
    // (existing code)
    switch (p) {
      case 'Instagram': return <div className="size-6 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">IG</div>;
      case 'X': return <div className="size-6 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold shadow-sm">X</div>;
      case 'YouTube': return <div className="size-6 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">YT</div>;
      default: return null;
    }
  };

  const getStatusStyle = (s: string) => {
    // (existing code)
    switch (s) {
      case 'Planejado': return 'bg-blue-100 text-blue-800';
      case 'Pendente': return 'bg-orange-100 text-orange-800';
      case 'Publicado': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const handleBrainstorm = async () => {
    const niche = window.prompt("Qual o seu nicho? (Ex: Fitness, Marketing, Pets)", "Marketing Digital");
    if (!niche) return;

    setModalTitle('💡 Brainstorm de Ideias');
    setModalContent('');
    setModalOpen(true);
    setActionLoading(true);

    try {
      const ideas = await generateBrainstorm(niche);
      setModalContent(ideas);
    } catch (error) {
      setModalContent("Erro ao gerar ideias. Tente novamente.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleScript = async () => {
    const topic = window.prompt("Sobre qual tema você quer um roteiro curto?", "Dicas de Produtividade");
    if (!topic) return;

    setModalTitle('📝 Roteiro Rápido (Reels/TikTok)');
    setModalContent('');
    setModalOpen(true);
    setActionLoading(true);

    try {
      const script = await generateQuickScript(topic);
      setModalContent(script);
    } catch (error) {
      setModalContent("Erro ao gerar roteiro.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 relative">
      <div className="max-w-[1100px] mx-auto space-y-8">
        {/* ... (Header and Stats Section - unchanged) */}
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

        {/* Quick Actions Section */}
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
            <div
              onClick={handleBrainstorm}
              className="flex flex-col justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-primary/50 cursor-pointer transition-all group hover:bg-white hover:shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform origin-left">lightbulb</span>
              <div>
                <h3 className="text-slate-900 text-sm font-bold">Brainstorm</h3>
                <p className="text-slate-500 text-xs">Lista de 10 ideias</p>
              </div>
            </div>
            <div
              onClick={handleScript}
              className="flex flex-col justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-primary/50 cursor-pointer transition-all group hover:bg-white hover:shadow-md active:scale-95"
            >
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
            {content.length === 0 && !loading ? (
              <div className="p-12 text-center">
                <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-slate-400">event_busy</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhum conteúdo agendado</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  Comece gerando ideias com IA e agendando seus posts para as redes sociais.
                </p>
                <button
                  onClick={() => onNavigate(View.IDEAS)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <span className="material-symbols-outlined">bolt</span>
                  Gerar Ideias
                </button>
              </div>
            ) : (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-center">
                <button onClick={() => onNavigate(View.CALENDAR)} className="text-xs font-black text-slate-400 hover:text-primary uppercase tracking-[0.2em] transition-colors">
                  Ver Agenda Completa
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Quick Action */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{modalTitle}</h3>
              <button onClick={() => setModalOpen(false)} className="size-10 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {actionLoading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-slate-500 animate-pulse font-medium">Gerando com IA...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.isArray(modalContent) ? (
                    <ul className="space-y-2">
                      {modalContent.map((item, idx) => (
                        <li key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors">
                          <span className="flex items-center justify-center size-6 rounded-full bg-white text-primary text-xs font-bold shadow-sm shrink-0 border border-slate-100">{idx + 1}</span>
                          <p className="text-slate-700 font-medium">{item}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="whitespace-pre-line p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed font-medium">
                      {modalContent}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-end">
              <button
                onClick={() => {
                  const text = Array.isArray(modalContent) ? modalContent.join('\n') : modalContent;
                  navigator.clipboard.writeText(text);
                  alert('Copiado para a área de transferência!');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                Copiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
