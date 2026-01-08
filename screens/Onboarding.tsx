
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [platform, setPlatform] = useState('');
  const [niche, setNiche] = useState<string[]>(['Fitness & Saúde']);
  const [objective, setObjective] = useState('');

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: 'photo_camera', color: 'from-yellow-400 via-red-500 to-purple-500' },
    { id: 'tiktok', name: 'TikTok', icon: 'music_note', color: 'bg-black' },
    { id: 'youtube', name: 'YouTube', icon: 'play_arrow', color: 'bg-red-600' },
    { id: 'shorts', name: 'Shorts', icon: 'bolt', color: 'bg-red-600' },
  ];

  const niches = [
    'Lifestyle', 'Fitness & Saúde', 'Espiritualidade', 'Relacionamento',
    'Finanças', 'Educação', 'Humor', 'Negócios'
  ];

  const objectives = [
    { id: 'growth', title: 'Crescimento Rápido', desc: 'Focar em viralização e ganho de seguidores.', icon: 'trending_up', color: 'bg-green-100 text-green-600' },
    { id: 'engagement', title: 'Engajamento', desc: 'Conectar profundamente com a comunidade.', icon: 'favorite', color: 'bg-pink-100 text-pink-600' },
    { id: 'authority', title: 'Autoridade', desc: 'Posicionamento como expert no nicho.', icon: 'verified', color: 'bg-blue-100 text-blue-600' },
    { id: 'sales', title: 'Vendas', desc: 'Conversão direta de seguidores em clientes.', icon: 'shopping_cart', color: 'bg-purple-100 text-purple-600' },
  ];

  const toggleNiche = (item: string) => {
    setNiche(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-10 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Passo 1 de 3</span>
            <span className="text-sm text-slate-500">Configuração Inicial</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/3 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Configuração de Conteúdo</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Personalize suas preferências para que nossa IA possa gerar as melhores recomendações para o seu perfil.
          </p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Platform */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">smartphone</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">1. Qual sua plataforma principal?</h3>
                <p className="text-slate-500 text-sm mt-1">Escolha onde você tem mais audiência ou deseja focar.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all relative ${platform === p.id ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 bg-slate-50 hover:border-primary/50'
                    }`}
                >
                  <div className={`size-12 rounded-full flex items-center justify-center text-white mb-3 shadow-sm transition-transform ${platform === p.id ? 'scale-110' : ''} ${p.color.includes('bg-') ? p.color : 'bg-gradient-to-tr ' + p.color}`}>
                    <span className="material-symbols-outlined">{p.icon}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{p.name}</span>
                  {platform === p.id && (
                    <span className="material-symbols-outlined icon-filled absolute top-3 right-3 text-primary">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Niche */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">category</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">2. Qual seu nicho de atuação?</h3>
                <p className="text-slate-500 text-sm mt-1">Selecione uma ou mais categorias que definem seu conteúdo.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {niches.map(n => (
                <button
                  key={n}
                  onClick={() => toggleNiche(n)}
                  className={`px-4 py-2 rounded-full font-medium text-sm border transition-all ${niche.includes(n) ? 'bg-primary text-white border-primary shadow-lg' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
                    }`}
                >
                  {n}
                </button>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem('customNiche') as HTMLInputElement;
                  if (input.value.trim()) {
                    toggleNiche(input.value.trim());
                    input.value = '';
                  }
                }}
                className="flex items-center bg-slate-100 rounded-full pl-4 pr-2 py-1 w-40 focus-within:ring-2 focus-within:ring-primary/50"
              >
                <input name="customNiche" className="bg-transparent border-none text-sm focus:ring-0 w-full p-0 h-6" placeholder="Outro..." type="text" />
                <button type="submit" className="size-6 rounded-full bg-slate-200 hover:bg-primary hover:text-white flex items-center justify-center text-slate-500 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </form>
            </div>
          </div>

          {/* Section 3: Objective */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined">flag</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">3. Qual seu objetivo atual?</h3>
                <p className="text-slate-500 text-sm mt-1">Isso ajudará a definir a estratégia de crescimento.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {objectives.map(obj => (
                <button
                  key={obj.id}
                  onClick={() => setObjective(obj.id)}
                  className={`relative p-5 rounded-xl border-2 transition-all flex items-start gap-4 text-left ${objective === obj.id ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 bg-slate-50 hover:border-primary/50'
                    }`}
                >
                  <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${obj.color}`}>
                    <span className="material-symbols-outlined">{obj.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{obj.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{obj.desc}</p>
                  </div>
                  {objective === obj.id && (
                    <span className="material-symbols-outlined icon-filled absolute top-4 right-4 text-primary">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <button className="px-8 py-3 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition-colors w-full md:w-auto">
              Voltar
            </button>
            <button
              onClick={onComplete}
              disabled={!platform || niche.length === 0 || !objective}
              className="px-8 py-3 rounded-lg bg-primary hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 w-full md:w-auto flex items-center justify-center gap-2"
            >
              <span>Gerar Planejamento</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
