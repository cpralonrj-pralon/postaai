
import React, { useState } from 'react';

type PanelType = 'ai' | 'templates' | 'texto' | 'fotos' | 'elementos' | 'uploads' | null;

const sidebarItems = [
  { id: 'ai' as PanelType, label: 'AI', icon: 'auto_awesome', filled: true },
  { id: 'templates' as PanelType, label: 'Templates', icon: 'grid_view', filled: false },
  { id: 'texto' as PanelType, label: 'Texto', icon: 'title', filled: false },
  { id: 'fotos' as PanelType, label: 'Fotos', icon: 'image', filled: false },
  { id: 'elementos' as PanelType, label: 'Elementos', icon: 'shapes', filled: false },
  { id: 'uploads' as PanelType, label: 'Uploads', icon: 'cloud_upload', filled: false },
];

const Editor: React.FC = () => {
  const [selectedSlide, setSelectedSlide] = useState(1);
  const [textColor, setTextColor] = useState('#111118');
  const [activePanel, setActivePanel] = useState<PanelType>('ai');

  const togglePanel = (panelId: PanelType) => {
    setActivePanel(prev => prev === panelId ? null : panelId);
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'ai':
        return (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary icon-filled">auto_awesome</span>
              <h3 className="text-lg font-bold text-slate-900">Assistente IA</h3>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase">Gerador de Imagem</label>
              <textarea className="w-full text-sm p-3 rounded-lg border-slate-200 bg-white resize-none focus:ring-primary focus:border-primary" placeholder="Descreva uma imagem para o fundo..." rows={3}></textarea>
              <button className="w-full h-10 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">brush</span>
                Gerar Imagem
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase">Gerador de Legenda</label>
              <button className="w-full h-10 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">smart_button</span>
                Gerar Legenda
              </button>
            </div>
          </div>
        );
      case 'templates':
        return (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">grid_view</span>
              <h3 className="text-lg font-bold text-slate-900">Templates</h3>
            </div>
            <input type="text" placeholder="Buscar templates..." className="w-full h-10 px-4 rounded-lg border border-slate-200 text-sm focus:ring-primary focus:border-primary" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[4/5] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-3xl">image</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'texto':
        return (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">title</span>
              <h3 className="text-lg font-bold text-slate-900">Texto</h3>
            </div>
            <button className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 text-left hover:border-primary transition-colors">
              <span className="text-2xl font-black text-slate-900">Título</span>
            </button>
            <button className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 text-left hover:border-primary transition-colors">
              <span className="text-lg font-bold text-slate-700">Subtítulo</span>
            </button>
            <button className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 text-left hover:border-primary transition-colors">
              <span className="text-sm text-slate-600">Corpo de texto</span>
            </button>
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">Cor do Texto</label>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-10 w-full rounded-lg border-none p-0 cursor-pointer" />
            </div>
          </div>
        );
      case 'fotos':
        return (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">image</span>
              <h3 className="text-lg font-bold text-slate-900">Fotos</h3>
            </div>
            <input type="text" placeholder="Buscar fotos..." className="w-full h-10 px-4 rounded-lg border border-slate-200 text-sm focus:ring-primary focus:border-primary" />
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg cursor-pointer hover:shadow-md transition-shadow"></div>
              ))}
            </div>
          </div>
        );
      case 'elementos':
        return (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">shapes</span>
              <h3 className="text-lg font-bold text-slate-900">Elementos</h3>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">Formas</label>
              <div className="flex gap-2 flex-wrap">
                {['square', 'circle', 'hexagon', 'star', 'favorite'].map(shape => (
                  <button key={shape} className="size-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">{shape}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">Linhas</label>
              <div className="flex gap-2 flex-wrap">
                {['horizontal_rule', 'arrow_right_alt', 'trending_up'].map(line => (
                  <button key={line} className="size-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">{line}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'uploads':
        return (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">cloud_upload</span>
              <h3 className="text-lg font-bold text-slate-900">Uploads</h3>
            </div>
            <button className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-colors gap-2">
              <span className="material-symbols-outlined text-3xl">upload_file</span>
              <span className="text-sm font-medium">Enviar arquivos</span>
            </button>
            <p className="text-xs text-slate-400 text-center">Arraste e solte ou clique para fazer upload</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center justify-between border-b border-slate-200 bg-white px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-slate-900 text-sm font-bold leading-tight">Novo Carrossel - Instagram</h2>
            <span className="text-[10px] text-slate-400">Salvo automaticamente</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-3 bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 rounded-lg">
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            Preview
          </button>
          <button className="flex items-center gap-1.5 h-8 px-4 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-blue-700">
            Publicar
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Icon Sidebar */}
        <aside className="w-[72px] bg-white border-r border-slate-200 flex flex-col items-center py-3 gap-1 shrink-0">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => togglePanel(item.id)}
              className={`flex flex-col items-center gap-0.5 py-2 px-1 w-full rounded-lg transition-all ${activePanel === item.id
                  ? 'text-primary bg-primary/5'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              <div className={`size-9 rounded-lg flex items-center justify-center ${activePanel === item.id ? 'bg-primary/10' : ''}`}>
                <span className={`material-symbols-outlined ${item.filled && activePanel === item.id ? 'icon-filled' : ''}`}>
                  {item.icon}
                </span>
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Expandable Panel */}
        {activePanel && (
          <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0 shadow-sm">
            <div className="h-12 px-4 border-b border-slate-100 flex items-center justify-end shrink-0">
              <button onClick={() => setActivePanel(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            {renderPanelContent()}
          </aside>
        )}

        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col bg-slate-100 relative overflow-hidden">
          <div className="flex-1 overflow-auto flex items-center justify-center p-6 relative">
            {/* Zoom Controls */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white shadow-sm border border-slate-200 rounded-full h-9 px-3 flex items-center gap-3 z-10">
              <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-sm">remove</span></button>
              <span className="text-xs font-semibold text-slate-700 w-8 text-center">48%</span>
              <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-sm">add</span></button>
              <div className="w-px h-4 bg-slate-200"></div>
              <button className="flex items-center gap-1 text-xs font-medium text-slate-600">
                <span className="material-symbols-outlined text-[14px]">crop_portrait</span>
                4:5
              </button>
            </div>

            {/* Canvas */}
            <div className="relative bg-white shadow-2xl overflow-hidden rounded-sm" style={{ width: 400, height: 500 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/80 to-blue-500/80 p-6 flex flex-col justify-center">
                <div className="bg-primary text-white text-[9px] font-bold uppercase py-1 px-2 rounded w-fit mb-3">Novo Post</div>
                <h1 className="text-4xl font-black text-slate-900 leading-[1.1] mb-4 border-2 border-transparent hover:border-primary/50 border-dashed rounded cursor-move p-1" style={{ color: textColor }}>
                  5 Dicas para <br /><span className="text-primary">Engajar</span> sua <br />Audiência
                </h1>
                <div className="mt-auto flex items-center gap-2">
                  <div className="size-8 rounded-full bg-slate-900/20 flex items-center justify-center"><span className="material-symbols-outlined text-white text-sm">person</span></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">@creator.studio</span>
                    <span className="text-[10px] text-slate-700">Marketing Digital</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Thumbnails */}
          <div className="h-40 bg-white border-t border-slate-200 flex flex-col shrink-0">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Slides (5)</span>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Gerar Automático
              </button>
            </div>
            <div className="flex-1 overflow-x-auto flex items-center px-3 gap-2 py-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex flex-col gap-1 min-w-[80px] cursor-pointer" onClick={() => setSelectedSlide(i)}>
                  <div className={`relative w-[80px] aspect-[4/5] rounded-md border-2 overflow-hidden shadow-sm transition-all ${selectedSlide === i ? 'border-primary' : 'border-slate-100 hover:border-slate-300'}`}>
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <span className="material-symbols-outlined text-xl">image</span>
                    </div>
                    <div className={`absolute top-0.5 left-0.5 size-4 text-white rounded-full flex items-center justify-center text-[8px] font-bold ${selectedSlide === i ? 'bg-primary' : 'bg-slate-400'}`}>
                      {i}
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-[80px] aspect-[4/5] rounded-md border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary shrink-0">
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Editor;
