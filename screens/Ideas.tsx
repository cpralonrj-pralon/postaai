
import React, { useState, useEffect } from 'react';
import { generateContentIdeas } from '../geminiService';
import { ContentIdea } from '../types';

const Ideas: React.FC = () => {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('Todos');

  const fetchIdeas = async () => {
    setLoading(true);
    const result = await generateContentIdeas('Fitness & Saúde', 'Crescimento Rápido');
    // Supplement with some sample images for better look
    const enhancedResult = result.map((idea, idx) => ({
      ...idea,
      image: `https://images.unsplash.com/photo-${[
        '1517836357463-d25dfeac3438',
        '1552674605-db6ffd4facb5',
        '1549576490-b0b4831da60a',
        '1571019613454-1cb2f99b2d8b',
        '1599058917232-d750c8217427',
        '1534438327276-14e5300c3a48'
      ][idx % 6]}?auto=format&fit=crop&q=80&w=800`
    }));
    setIdeas(enhancedResult);
    setLoading(false);
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const filters = [
    { label: 'Todos', icon: null },
    { label: 'Reels', icon: 'movie', color: 'text-pink-500' },
    { label: 'Carousel', icon: 'view_carousel', color: 'text-purple-500' },
    { label: 'Stories', icon: 'history_edu', color: 'text-orange-400' },
    { label: 'Static', icon: 'image', color: 'text-blue-500' },
  ];

  const filteredIdeas = filter === 'Todos' ? ideas : ideas.filter(i => i.type.includes(filter.replace('s', '')));

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 md:px-10 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary mb-1">
              <span className="material-symbols-outlined text-sm icon-filled">auto_awesome</span>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Sugestões de IA</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Ideias de Conteúdo</h2>
            <p className="text-slate-500 max-w-2xl text-base font-medium">
              Estratégias personalizadas para o nicho de <strong className="text-slate-900 underline decoration-primary decoration-2 underline-offset-4">Fitness & Saúde</strong>.
            </p>
          </div>
          <button 
            onClick={fetchIdeas}
            disabled={loading}
            className="flex items-center justify-center gap-2 h-12 px-6 bg-primary text-white text-sm font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">{loading ? 'sync' : 'bolt'}</span>
            <span>{loading ? 'Sincronizando...' : 'Gerar Novas Ideias'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {filters.map(f => (
            <button
              key={f.label}
              onClick={() => setFilter(f.label)}
              className={`flex items-center gap-2 h-10 px-5 rounded-full border-2 transition-all text-sm font-bold ${
                filter === f.label 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
              }`}
            >
              {f.icon && <span className={`material-symbols-outlined text-[18px] ${filter === f.label ? 'text-white' : f.color}`}>{f.icon}</span>}
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[450px] bg-white rounded-3xl border border-slate-100 animate-pulse flex flex-col p-6 space-y-4">
                <div className="w-full h-48 bg-slate-100 rounded-2xl"></div>
                <div className="w-2/3 h-6 bg-slate-100 rounded-full"></div>
                <div className="w-full h-20 bg-slate-100 rounded-xl"></div>
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
              <div key={idea.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className={`relative h-56 flex items-center justify-center overflow-hidden`}>
                  <img src={idea.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={idea.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        {idea.type === 'Reels' ? 'movie' : idea.type === 'Carousel' ? 'view_carousel' : idea.type === 'Story' ? 'history_edu' : 'image'}
                      </span>
                      {idea.type}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-6 right-6 text-white">
                    <h3 className="font-black text-xl leading-tight drop-shadow-lg">{idea.title}</h3>
                  </div>
                </div>

                <div className="flex flex-col p-6 gap-5 flex-1 bg-white">
                  <div className="space-y-3">
                    {idea.hook && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hook Sugerido</p>
                        <p className="text-sm text-slate-900 font-bold leading-relaxed">"{idea.hook}"</p>
                      </div>
                    )}
                    {idea.description && (
                      <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">{idea.description}</p>
                    )}
                    {idea.structure && (
                      <div className="space-y-1.5">
                         {idea.structure.map((s, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="size-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{idx+1}</span>
                              <span className="text-xs font-semibold text-slate-700">{s}</span>
                            </div>
                         ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3 mt-auto pt-4">
                    <button className="flex-1 h-11 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/20 hover:bg-blue-700 flex items-center justify-center gap-2 group/btn">
                      Abrir Editor
                      <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                    <button className="size-11 flex items-center justify-center rounded-xl border-2 border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all">
                      <span className="material-symbols-outlined text-[20px] group-hover:icon-filled">bookmark</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ideas;
