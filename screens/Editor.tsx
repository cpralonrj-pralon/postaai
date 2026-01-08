
import React, { useState } from 'react';

const Editor: React.FC = () => {
  const [selectedSlide, setSelectedSlide] = useState(1);
  const [textColor, setTextColor] = useState('#111118');

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="h-16 flex items-center justify-between border-b border-slate-200 bg-white px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="size-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-slate-900 text-sm font-bold">Novo Carrossel - Instagram</h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-600 uppercase">Gemini Nano Banana</span>
            </div>
            <span className="text-xs text-slate-500">Salvo automaticamente</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-9 px-3 bg-white border border-slate-200 text-slate-900 text-sm font-semibold hover:bg-slate-50 rounded-lg">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Preview</span>
          </button>
          <button className="flex items-center gap-2 h-9 px-4 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-blue-700">
            <span>Publicar</span>
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-6 shrink-0 overflow-y-auto">
          <button className="flex flex-col items-center gap-1 group w-full text-blue-600">
            <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center transition-all group-hover:scale-105">
              <span className="material-symbols-outlined icon-filled">auto_awesome</span>
            </div>
            <span className="text-[10px] font-bold">AI</span>
          </button>
          {['Templates', 'Texto', 'Fotos', 'Elementos', 'Uploads'].map(item => (
            <button key={item} className="flex flex-col items-center gap-1 group w-full text-slate-500 hover:text-slate-900">
              <div className="size-10 rounded-xl flex items-center justify-center hover:bg-slate-50">
                <span className="material-symbols-outlined">
                  {item === 'Templates' ? 'grid_view' : item === 'Texto' ? 'title' : item === 'Fotos' ? 'image' : item === 'Elementos' ? 'shapes' : 'cloud_upload'}
                </span>
              </div>
              <span className="text-[10px] font-medium">{item}</span>
            </button>
          ))}
        </aside>

        <main className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
          <div className="flex-1 overflow-auto flex items-center justify-center p-8 relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white shadow-sm border border-slate-200 rounded-full h-10 px-4 flex items-center gap-4 z-10">
              <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-sm">remove</span></button>
              <span className="text-xs font-semibold text-slate-700 w-8 text-center">48%</span>
              <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-sm">add</span></button>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button className="flex items-center gap-1 text-xs font-medium text-slate-600">
                <span className="material-symbols-outlined text-[16px]">crop_portrait</span>
                <span>4:5</span>
              </button>
            </div>
            
            <div className="relative bg-white shadow-2xl overflow-hidden rounded-sm" style={{ width: 432, height: 540 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/80 to-blue-500/80 p-8 flex flex-col justify-center">
                <div className="bg-primary text-white text-[10px] font-bold uppercase py-1 px-2 rounded w-fit mb-4">Novo Post</div>
                <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-6 border-2 border-transparent hover:border-primary/50 border-dashed rounded cursor-move p-2" style={{ color: textColor }}>
                  5 Dicas para <br/><span className="text-primary">Engajar</span> sua <br/>Audiência
                </h1>
                <div className="mt-auto flex items-center gap-3">
                  <div className="size-10 rounded-full bg-slate-900/20 flex items-center justify-center"><span className="material-symbols-outlined text-white">person</span></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">@creator.studio</span>
                    <span className="text-xs text-slate-700">Marketing Digital</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-48 bg-white border-t border-slate-200 flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Slides (5)</span>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                Gerar Carrossel Automático
              </button>
            </div>
            <div className="flex-1 overflow-x-auto flex items-center px-4 gap-3 py-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex flex-col gap-2 min-w-[100px] cursor-pointer" onClick={() => setSelectedSlide(i)}>
                  <div className={`relative w-[100px] aspect-[4/5] rounded-lg border-2 overflow-hidden shadow-sm transition-all ${selectedSlide === i ? 'border-primary' : 'border-slate-100 hover:border-slate-300'}`}>
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                    <div className={`absolute top-1 left-1 size-5 text-white rounded-full flex items-center justify-center text-[10px] font-bold ${selectedSlide === i ? 'bg-primary' : 'bg-slate-400'}`}>
                      {i}
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium text-center ${selectedSlide === i ? 'text-primary' : 'text-slate-500'}`}>Slide {i}</span>
                </div>
              ))}
              <button className="w-[100px] aspect-[4/5] rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary">
                <span className="material-symbols-outlined">add</span>
                <span className="text-[10px] font-bold">Adicionar</span>
              </button>
            </div>
          </div>
        </main>

        <aside className="w-72 bg-white border-l border-slate-200 flex flex-col overflow-y-auto shrink-0 shadow-sm">
          <div className="h-14 px-5 border-b border-slate-100 flex items-center justify-between shrink-0">
            <span className="text-sm font-bold text-slate-900">Ferramentas</span>
            <button className="text-slate-400"><span className="material-symbols-outlined text-lg">close</span></button>
          </div>
          <div className="p-5 space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-sm">auto_awesome</span>
                <label className="text-xs font-bold text-slate-700 uppercase">Gerador Gemini AI</label>
              </div>
              <textarea className="w-full text-xs p-3 rounded-lg border-slate-200 bg-white resize-none focus:ring-primary focus:border-primary" placeholder="Descreva uma imagem para o fundo..." rows={3}></textarea>
              <button className="w-full h-8 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[14px]">brush</span>
                Gerar Imagem
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase">Texto Selecionado</label>
              <select className="w-full h-10 px-3 rounded-lg border-slate-200 text-sm focus:ring-primary focus:border-primary">
                <option>Inter</option>
                <option>Roboto</option>
              </select>
              <div className="flex gap-2">
                <select className="flex-1 h-10 px-3 rounded-lg border-slate-200 text-sm">
                  <option>Black</option>
                  <option>Bold</option>
                </select>
                <input type="number" defaultValue={48} className="w-20 h-10 rounded-lg border-slate-200 text-sm" />
              </div>
              <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                {['format_align_left', 'format_align_center', 'format_align_right'].map(icon => (
                  <button key={icon} className="flex-1 h-8 rounded hover:bg-white flex items-center justify-center text-slate-500 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] text-slate-400">Cor do Texto</span>
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-9 w-full rounded-lg border-none p-0 cursor-pointer" />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] text-slate-400">Espaçamento</span>
                  <div className="h-9 w-full rounded-lg border border-slate-200 flex items-center justify-center"><span className="material-symbols-outlined text-slate-500 text-[18px]">format_line_spacing</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-500 uppercase">Opacidade</label>
                <span className="text-xs font-medium">100%</span>
              </div>
              <input type="range" className="w-full accent-primary" />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button className="w-full h-10 rounded-lg bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-[18px]">smart_button</span>
                Gerar Legenda AI
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Editor;
