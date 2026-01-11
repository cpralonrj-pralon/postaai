
import React, { useState, useEffect } from 'react';
import { generateContentIdeas } from '../geminiService';
import { generateImage, createImagePrompt } from '../kieService';
import { ContentIdea, ScheduledContent } from '../types';
import { supabaseService } from '../services/supabaseService';

// Edit Modal Component
interface EditModalProps {
  idea: ContentIdea;
  onSave: (updated: ContentIdea) => void;
  onSchedule: (idea: ContentIdea, date: string, time: string) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ idea, onSave, onSchedule, onClose }) => {
  const [editedIdea, setEditedIdea] = useState<ContentIdea>({ ...idea });
  const [mode, setMode] = useState<'edit' | 'schedule'>('edit');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Pre-fill date/time for convenience (default to tomorrow 10am)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduleDate(tomorrow.toISOString().split('T')[0]);
    setScheduleTime('10:00');
  }, []);

  const contentTypes: ContentIdea['type'][] = ['Reels', 'Carousel', 'Story', 'Static', 'Promo'];

  const handleSaveOnly = () => {
    onSave({ ...editedIdea, isEdited: true });
    onClose();
  };

  const handleScheduleConfirm = () => {
    onSave({ ...editedIdea, isEdited: true }); // Save edits first
    onSchedule(editedIdea, scheduleDate, scheduleTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <div className={`size-10 rounded-xl flex items-center justify-center ${mode === 'schedule' ? 'bg-purple-100 text-purple-600' : 'bg-primary/10 text-primary'}`}>
              <span className="material-symbols-outlined">{mode === 'schedule' ? 'event' : 'edit_note'}</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{mode === 'schedule' ? 'Agendar Conteúdo' : 'Editar Ideia'}</h3>
              <p className="text-xs text-slate-500">{mode === 'schedule' ? 'Defina quando este post vai ao ar' : 'Personalize este conteúdo para sua marca'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Scheduling Section (Highlighted) */}
          {mode === 'schedule' && (
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 mb-6 space-y-4 animate-in slide-in-from-top-4">
              <div className="flex items-center gap-2 text-purple-700 font-bold border-b border-purple-100 pb-2">
                <span className="material-symbols-outlined">calendar_today</span>
                <h4>Definir Data e Hora</h4>
              </div>

              {idea.bestTime && (
                <div className="flex items-start gap-2 text-xs text-purple-600 bg-white/50 p-3 rounded-xl">
                  <span className="material-symbols-outlined text-sm mt-0.5">auto_awesome</span>
                  <p><strong>Sugestão da IA:</strong> {idea.bestTime}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-purple-700 uppercase">Data</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-slate-700 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-purple-700 uppercase">Hora</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-slate-700 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Formato do Conteúdo</label>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setEditedIdea({ ...editedIdea, type })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all text-sm font-semibold ${editedIdea.type === type
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {type === 'Reels' ? 'movie' : type === 'Carousel' ? 'view_carousel' : type === 'Story' ? 'history_edu' : type === 'Promo' ? 'campaign' : 'image'}
                  </span>
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Título / Headline</label>
            <input
              type="text"
              value={editedIdea.title}
              onChange={e => setEditedIdea({ ...editedIdea, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none text-slate-900 font-semibold transition-colors"
              placeholder="Digite um título chamativo..."
            />
          </div>

          {/* Hook */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hook (Gancho Inicial)</label>
            <input
              type="text"
              value={editedIdea.hook || ''}
              onChange={e => setEditedIdea({ ...editedIdea, hook: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none text-slate-900 transition-colors"
              placeholder="O que vai prender a atenção nos primeiros segundos?"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Descrição Estratégica</label>
            <textarea
              value={editedIdea.description || ''}
              onChange={e => setEditedIdea({ ...editedIdea, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none text-slate-900 resize-none transition-colors"
              placeholder="Explique o objetivo e valor deste conteúdo..."
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Legenda para Publicação</label>
            <textarea
              value={editedIdea.caption || ''}
              onChange={e => setEditedIdea({ ...editedIdea, caption: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none text-slate-900 resize-none transition-colors"
              placeholder="Escreva a legenda com emojis e hashtags..."
            />
          </div>

          {/* Call to Action */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Chamada para Ação (CTA)</label>
            <input
              type="text"
              value={editedIdea.callToAction || ''}
              onChange={e => setEditedIdea({ ...editedIdea, callToAction: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none text-slate-900 transition-colors"
              placeholder="Ex: Comente '🔥' se você concorda!"
            />
          </div>

          {/* Structure for Stories */}
          {editedIdea.type === 'Story' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estrutura dos Stories</label>
              <div className="space-y-2">
                {(editedIdea.structure || ['']).map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                    <input
                      type="text"
                      value={step}
                      onChange={e => {
                        const newStructure = [...(editedIdea.structure || [])];
                        newStructure[idx] = e.target.value;
                        setEditedIdea({ ...editedIdea, structure: newStructure });
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-primary focus:outline-none text-sm transition-colors"
                      placeholder={`Slide ${idx + 1}...`}
                    />
                    {(editedIdea.structure?.length || 0) > 1 && (
                      <button
                        onClick={() => {
                          const newStructure = (editedIdea.structure || []).filter((_, i) => i !== idx);
                          setEditedIdea({ ...editedIdea, structure: newStructure });
                        }}
                        className="size-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setEditedIdea({ ...editedIdea, structure: [...(editedIdea.structure || []), ''] })}
                  className="text-sm font-semibold text-primary hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Adicionar Slide
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3 rounded-b-3xl">
          <div className="flex gap-2">
            {mode === 'edit' ? (
              <button
                onClick={() => setMode('schedule')}
                className="px-4 py-3 rounded-xl bg-purple-100 text-purple-700 font-bold text-sm hover:bg-purple-200 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined">event</span>
                <span>Agendar</span>
              </button>
            ) : (
              <button
                onClick={() => setMode('edit')}
                className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined">edit</span>
                <span>Voltar para Edição</span>
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>

            {mode === 'edit' ? (
              <button
                onClick={handleSaveOnly}
                className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                Salvar
              </button>
            ) : (
              <button
                onClick={handleScheduleConfirm}
                className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">event_available</span>
                Confirmar Agendamento
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


// Main Ideas Component
interface IdeasProps {
  onEdit?: (idea: ContentIdea) => void;
}

const Ideas: React.FC<IdeasProps> = ({ onEdit }) => {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [editingIdea, setEditingIdea] = useState<ContentIdea | null>(null);
  const [userNiche, setUserNiche] = useState('Fitness & Saúde');
  const [userGoal, setUserGoal] = useState('Crescimento Rápido');

  // Função para buscar imagens relevantes do Unsplash
  const fetchUnsplashImage = async (niche: string, index: number): Promise<string> => {
    // Usando placehold.co como fallback confiável
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `https://placehold.co/800x600/${randomColor}/white?text=${userNiche}`;
  };

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      // Gerar ideias com Gemini
      const result = await generateContentIdeas(userNiche, userGoal);

      console.log('🎨 Generating images with Kie.ai...');

      // Gerar imagens com Kie.ai baseadas nas ideias
      const enhancedResult = await Promise.all(
        result.map(async (idea, idx) => {
          try {
            // Criar prompt específico para a imagem
            const imagePrompt = createImagePrompt(userNiche, idea.title, idea.type);

            // Tentar gerar imagem com Kie.ai
            const imageUrl = await generateImage(imagePrompt, {
              model: 'flux-kontext',
              width: 800,
              height: 600
            });

            return {
              ...idea,
              image: imageUrl
            };
          } catch (error) {
            console.error(`Error generating image for idea ${idx}:`, error);
            // Fallback para Unsplash/Placeholder se Kie.ai falhar
            return {
              ...idea,
              image: await fetchUnsplashImage(userNiche, idx)
            };
          }
        })
      );

      setIdeas(enhancedResult);

      // Salvar ideias no banco de dados
      // NOTA: Removemos o ID gerado pela IA (que pode ser inválido/mock) para o Supabase gerar um UUID válido
      await Promise.all(
        enhancedResult.map(idea => {
          const { id, ...ideaWithoutId } = idea;
          return supabaseService.saveIdea(ideaWithoutId as ContentIdea);
        })
      );

      console.log('✅ Ideas and images generated successfully');
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);


  const handleUpdateIdea = (updatedIdea: ContentIdea) => {
    setIdeas(ideas.map(idea => idea.id === updatedIdea.id ? updatedIdea : idea));
  };

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleScheduleIdea = async (idea: ContentIdea, date: string, time: string) => {
    try {
      const scheduledItem: ScheduledContent = {
        id: crypto.randomUUID(), // Gera ID único para o agendamento
        title: idea.title,
        type: idea.type,
        platform: 'Instagram',
        date: `${date}T${time}:00`,
        status: 'Planejado',
        content: idea
      };

      await supabaseService.saveScheduledContent(scheduledItem);

      setToastMessage(`✅ Conteúdo agendado para ${date} às ${time}!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Erro ao agendar:', error);
      setToastMessage('❌ Erro ao agendar. Tente novamente.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const filters = [
    { label: 'Todos', icon: null },
    { label: 'Reels', icon: 'movie', color: 'text-pink-500' },
    { label: 'Carousel', icon: 'view_carousel', color: 'text-purple-500' },
    { label: 'Stories', icon: 'history_edu', color: 'text-orange-400' },
    { label: 'Static', icon: 'image', color: 'text-blue-500' },
  ];

  const filteredIdeas = filter === 'Todos'
    ? ideas
    : ideas.filter(i => {
      if (filter === 'Stories') return i.type === 'Story';
      return i.type === filter;
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Reels': return 'movie';
      case 'Carousel': return 'view_carousel';
      case 'Story': return 'history_edu';
      case 'Promo': return 'campaign';
      default: return 'image';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 md:px-10 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="material-symbols-outlined text-sm icon-filled">auto_awesome</span>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Sugestões de IA</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Ideias de Conteúdo</h2>
            <p className="text-slate-500 max-w-2xl text-base font-medium">
              Estratégias personalizadas por IA Especialista para o nicho de <strong className="text-slate-900 underline decoration-primary decoration-2 underline-offset-4">{userNiche}</strong>.
            </p>
          </div>
        </div>

        {/* Customization Inputs */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">tune</span>
            <h3 className="text-lg font-bold text-slate-900">Personalize o Agente IA</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Seu Nicho</label>
              <input
                type="text"
                value={userNiche}
                onChange={(e) => setUserNiche(e.target.value)}
                placeholder="Ex: Fitness, Moda, Tecnologia, Culinária..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none text-slate-900 font-medium transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Seu Objetivo</label>
              <input
                type="text"
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                placeholder="Ex: Crescimento Rápido, Engajamento, Vendas..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary focus:outline-none text-slate-900 font-medium transition-colors"
              />
            </div>
          </div>
          <button
            onClick={fetchIdeas}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 h-12 px-6 bg-primary text-white text-sm font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 active:scale-95"
          >
            <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>{loading ? 'sync' : 'bolt'}</span>
            <span>{loading ? 'Gerar Novas Ideias com IA' : 'Gerar Novas Ideias'}</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {filters.map(f => (
            <button
              key={f.label}
              onClick={() => setFilter(f.label)}
              className={`flex items-center gap-2 h-10 px-5 rounded-full border-2 transition-all text-sm font-bold ${filter === f.label
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                }`}
            >
              {f.icon && <span className={`material-symbols-outlined text-[18px] ${filter === f.label ? 'text-white' : f.color}`}>{f.icon}</span>}
              {f.label}
            </button>
          ))}
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[520px] bg-white rounded-3xl border border-slate-100 animate-pulse flex flex-col p-6 space-y-4">
                <div className="w-full h-48 bg-slate-100 rounded-2xl"></div>
                <div className="w-2/3 h-6 bg-slate-100 rounded-full"></div>
                <div className="w-full h-20 bg-slate-100 rounded-xl"></div>
                <div className="w-full h-16 bg-slate-50 rounded-xl"></div>
                <div className="mt-auto flex gap-2">
                  <div className="flex-1 h-10 bg-slate-100 rounded-lg"></div>
                  <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                onClick={() => setEditingIdea(idea)}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              >
                {/* Image Header */}
                <div className="relative h-48 flex items-center justify-center overflow-hidden bg-slate-100">
                  <img src={idea.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={idea.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        {getTypeIcon(idea.type)}
                      </span>
                      {idea.type}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-4 left-6 right-6 text-white">
                    <h3 className="font-black text-lg leading-tight drop-shadow-lg line-clamp-2">{idea.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col p-5 gap-4 flex-1 bg-white">

                  {/* AI Best Time Suggestion */}
                  {idea.bestTime && (
                    <div className="flex items-start gap-2 p-2 rounded-lg bg-green-50 text-green-700 border border-green-100">
                      <span className="material-symbols-outlined text-sm mt-0.5">query_stats</span>
                      <p className="text-[10px] font-bold uppercase tracking-wide flex-1">
                        Sugestão: <span className="font-medium normal-case text-slate-700">{idea.bestTime}</span>
                      </p>
                    </div>
                  )}

                  {/* Hook */}
                  {idea.hook && (
                    <div className="p-3 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl border border-primary/10">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">🎯 Hook</p>
                      <p className="text-sm text-slate-800 font-semibold leading-relaxed">"{idea.hook}"</p>
                    </div>
                  )}

                  {/* Description */}
                  {idea.description && (
                    <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-2">{idea.description}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-auto pt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEdit) onEdit(idea); // Opens in Editor
                        else setEditingIdea(idea); // Fallback to local modal
                      }}
                      className="flex-1 h-10 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-all hover:bg-slate-200 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">brush</span>
                      Criar Post AI
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingIdea(idea); }}
                      className="size-10 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 flex items-center justify-center transition-colors"
                      title="Edição Rápida"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingIdea(idea); /* Trigger schedule mode directly? For now just open modal */ }}
                      className="flex-1 h-10 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/20 hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                      Agendar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredIdeas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-slate-400">lightbulb</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhuma ideia encontrada</h3>
            <p className="text-slate-500 max-w-md mb-6">
              {filter !== 'Todos'
                ? `Não há ideias do tipo "${filter}" no momento. Tente gerar novas ideias ou selecione outro filtro.`
                : 'Clique em "Gerar Novas Ideias" para começar a criar conteúdo incrível!'}
            </p>
            <button
              onClick={fetchIdeas}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <span className="material-symbols-outlined">bolt</span>
              Gerar Novas Ideias
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingIdea && (
        <EditModal
          idea={editingIdea}
          onSave={handleUpdateIdea}
          onSchedule={handleScheduleIdea}
          onClose={() => setEditingIdea(null)}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md">
            <span className="text-2xl">{toastMessage.includes('✅') ? '✅' : '❌'}</span>
            <p className="font-medium">{toastMessage.replace(/[✅❌]/g, '').trim()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ideas;
