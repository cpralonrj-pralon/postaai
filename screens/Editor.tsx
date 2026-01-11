
import React, { useState, useRef, useEffect } from 'react';
import { generateImage } from '../kieService';
import { generateCaption } from '../geminiService';

type PanelType = 'ai' | 'templates' | 'texto' | 'fotos' | 'elementos' | 'uploads' | 'apps' | null;

interface CanvasElement {
  id: string;
  type: 'image' | 'shape';
  content: string; // URL for image, shape type for shape
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string; // For shapes
}

const sidebarItems = [
  { id: 'ai' as PanelType, label: 'AI', icon: 'auto_awesome', filled: true },
  { id: 'templates' as PanelType, label: 'Templates', icon: 'grid_view', filled: false },
  { id: 'texto' as PanelType, label: 'Texto', icon: 'title', filled: false },
  { id: 'fotos' as PanelType, label: 'Fotos', icon: 'image', filled: false },
  { id: 'elementos' as PanelType, label: 'Elementos', icon: 'shapes', filled: false },
  { id: 'uploads' as PanelType, label: 'Uploads', icon: 'cloud_upload', filled: false },
  { id: 'apps' as PanelType, label: 'Apps', icon: 'apps', filled: true },
];

const appsList = [
  { name: 'AI Music', icon: 'music_note', category: 'ai' },
  { name: 'Image Upscaler', icon: 'zoom_in', category: 'ai' },
  { name: 'Gen QR', icon: 'qr_code', category: 'ai' },
  { name: 'Reface', icon: 'face', category: 'ai' },
  { name: 'Voice AI', icon: 'record_voice_over', category: 'ai' },
  { name: 'AI Slides', icon: 'slideshow', category: 'ai' },
  { name: 'Colorize', icon: 'palette', category: 'tools' },
  { name: 'Background', icon: 'wallpaper', category: 'tools' },
  { name: 'Mockups', icon: 'devices', category: 'tools' },
  { name: 'Translate', icon: 'translate', category: 'tools' },
  { name: 'Charts', icon: 'bar_chart', category: 'tools' },
  { name: 'Videos', icon: 'videocam', category: 'tools' },
];

const postIdeas = [
  { title: "5 Dicas para Engajar", subtitle: "Como crescer no Instagram" },
  { title: "O Segredo do Sucesso", subtitle: "Mentalidade Vencedora" },
  { title: "Bastidores do Projeto", subtitle: "Making Of Exclusivo" },
  { title: "Promoção Relâmpago", subtitle: "Apenas hoje: 50% OFF" },
  { title: "Dúvidas Frequentes", subtitle: "Respondendo a vocês" },
  { title: "Minha Jornada", subtitle: "Como comecei do zero" }
];

import { ContentIdea } from '../types';

interface EditorProps {
  initialData?: ContentIdea;
}

const Editor: React.FC<EditorProps> = ({ initialData }) => {
  const [selectedSlide, setSelectedSlide] = useState(1);
  const [activePanel, setActivePanel] = useState<PanelType>('templates');
  const [isPanelPinned, setIsPanelPinned] = useState(false);

  // Responsive Canvas Logic
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasScale, setCanvasScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (!canvasContainerRef.current) return;
      const { clientWidth, clientHeight } = canvasContainerRef.current;
      const padding = 64; // Padding around canvas
      const availableWidth = Math.max(0, clientWidth - padding);
      const availableHeight = Math.max(0, clientHeight - padding);

      const targetWidth = 400;
      const targetHeight = 711; // 9:16 Aspect Ratio

      const scaleX = availableWidth / targetWidth;
      const scaleY = availableHeight / targetHeight;

      // Fit Contain Logic
      // Cap max scale at 1.0 (optional, but good for quality) or 1.2
      const newScale = Math.min(scaleX, scaleY, 0.95);
      setCanvasScale(Math.max(0.2, newScale)); // Min scale 0.2 to prevent disappearing
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);

    // Observer for container size changes (e.g. sidebar toggle)
    const observer = new ResizeObserver(calculateScale);
    if (canvasContainerRef.current) observer.observe(canvasContainerRef.current);

    return () => {
      window.removeEventListener('resize', calculateScale);
      observer.disconnect();
    };
  }, [activePanel, isPanelPinned]); // Re-calc when panels change layout

  // Canvas State
  const [elements, setElements] = useState<CanvasElement[]>([]);
  // Update state when initialData changes (e.g. re-entering editor)
  React.useEffect(() => {
    if (initialData) {
      setMainTitle(initialData.title);
      if (initialData.image) setBackgroundImage(initialData.image);
      if (initialData.caption) setGeneratedCaption(initialData.caption);
    }
  }, [initialData]);

  const [mainTitle, setMainTitle] = useState(initialData?.title || "5 Dicas para\nEngajar sua\nAudiência");
  const [mainTitleColor, setMainTitleColor] = useState('#111118');
  const [backgroundImage, setBackgroundImage] = useState(initialData?.image || '');

  // AI State
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState(initialData?.caption || '');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);

  // Interaction State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number, y: number, initialX: number, initialY: number } | null>(null); // For moving
  const [resizeStart, setResizeStart] = useState<{ x: number, y: number, initialW: number, initialH: number, initialX: number, initialY: number, direction: string } | null>(null); // For resizing

  // Uploads State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Delete Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        setElements(prev => prev.filter(el => el.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  // Mouse Handlers for Move/Resize
  const handleElementMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    const element = elements.find(el => el.id === id);
    if (!element) return;
    setDragStart({ x: e.clientX, y: e.clientY, initialX: element.x, initialY: element.y });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, id: string, direction: string) => {
    e.stopPropagation();
    const element = elements.find(el => el.id === id);
    if (!element) return;
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      initialW: element.width,
      initialH: element.height,
      initialX: element.x,
      initialY: element.y,
      direction
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStart && selectedId) {
      const dx = (e.clientX - dragStart.x) / canvasScale; // Adjust for zoom
      const dy = (e.clientY - dragStart.y) / canvasScale;
      setElements(prev => prev.map(el => {
        if (el.id === selectedId) {
          return { ...el, x: dragStart.initialX + dx, y: dragStart.initialY + dy };
        }
        return el;
      }));
    } else if (resizeStart && selectedId) {
      const dx = (e.clientX - resizeStart.x) / canvasScale;
      const dy = (e.clientY - resizeStart.y) / canvasScale;

      setElements(prev => prev.map(el => {
        if (el.id === selectedId) {
          let newW = resizeStart.initialW;
          let newH = resizeStart.initialH;
          let newX = resizeStart.initialX;
          let newY = resizeStart.initialY;

          // Simple resizing logic (Southeast corner for MVP simplicity, or full logic)
          if (resizeStart.direction.includes('e')) newW = Math.max(20, resizeStart.initialW + dx);
          if (resizeStart.direction.includes('s')) newH = Math.max(20, resizeStart.initialH + dy);
          if (resizeStart.direction.includes('w')) {
            newW = Math.max(20, resizeStart.initialW - dx);
            newX = resizeStart.initialX + dx;
          }
          if (resizeStart.direction.includes('n')) {
            newH = Math.max(20, resizeStart.initialH - dy);
            newY = resizeStart.initialY + dy;
          }

          return { ...el, width: newW, height: newH, x: newX, y: newY };
        }
        return el;
      }));
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
    setResizeStart(null);
  };

  // Window Event Listeners for smooth interaction
  useEffect(() => {
    if (dragStart || resizeStart) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragStart, resizeStart, selectedId, canvasScale]);

  const handleGenerateImage = async () => {
    if (!imagePrompt) return;
    setIsGeneratingImage(true);
    try {
      // Usar 9:16 ou fallback seguro
      const imageUrl = await generateImage(imagePrompt, { width: 800, height: 1422 });
      console.log('🖼️ Generated Image URL:', imageUrl);
      setBackgroundImage(imageUrl);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateCaption = async () => {
    setIsGeneratingCaption(true);
    try {
      const context = imagePrompt || "Marketing Digital e Conteúdo para Redes Sociais";
      const caption = await generateCaption(context);
      setGeneratedCaption(caption);
    } catch (error) {
      console.error('Failed to generate caption:', error);
      alert('Erro ao gerar legenda.');
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handleAddShape = (shape: string) => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type: 'shape',
      content: shape,
      x: 150, // Center-ish
      y: 200,
      width: 100,
      height: 100,
      color: '#3B82F6' // Primary blue by default
    };
    setElements([...elements, newElement]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedFiles(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddImageToCanvas = (url: string) => {
    const newElement: CanvasElement = {
      id: Date.now().toString(),
      type: 'image',
      content: url,
      x: 100,
      y: 150,
      width: 200,
      height: 200
    };
    setElements([...elements, newElement]);
  };

  const handleApplyTemplate = (idea: { title: string, subtitle: string }) => {
    setMainTitle(idea.title + '\n' + idea.subtitle);
  };

  const handleMouseEnter = (panelId: PanelType) => {
    setActivePanel(panelId);
  };

  const handleMouseLeave = () => {
    if (!isPanelPinned) {
      setActivePanel(null);
    }
  };

  const handlePanelClick = (panelId: PanelType) => {
    if (activePanel === panelId) {
      setIsPanelPinned(!isPanelPinned);
    } else {
      setActivePanel(panelId);
      setIsPanelPinned(true);
    }
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
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                className="w-full text-sm p-3 rounded-lg border-slate-200 bg-white resize-none focus:ring-primary focus:border-primary"
                placeholder="Descreva uma imagem para o fundo..."
                rows={3}
                disabled={isGeneratingImage}
              />
              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !imagePrompt}
                className="w-full h-10 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingImage ? (
                  <>
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">brush</span>
                    Gerar Imagem
                  </>
                )}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase">Gerador de Legenda</label>
              {generatedCaption ? (
                <div className="space-y-2">
                  <textarea
                    readOnly
                    value={generatedCaption}
                    className="w-full text-xs p-2 rounded-lg border-slate-200 text-slate-600 bg-white h-32 leading-relaxed resize-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCaption);
                      alert('Copiado!');
                    }}
                    className="w-full h-8 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    Copiar
                  </button>
                  <button
                    onClick={() => setGeneratedCaption('')}
                    className="w-full h-8 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Gerar Nova
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGenerateCaption}
                  disabled={isGeneratingCaption}
                  className="w-full h-10 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingCaption ? (
                    <>
                      <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Escrevendo...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">smart_button</span>
                      Gerar Legenda
                    </>
                  )}
                </button>
              )}
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
            <input type="text" placeholder="Buscar ideias..." className="w-full h-10 px-4 rounded-lg border border-slate-200 text-sm focus:ring-primary focus:border-primary" />
            <div className="grid grid-cols-2 gap-3">
              {postIdeas.map((idea, i) => (
                <div
                  key={i}
                  onClick={() => handleApplyTemplate(idea)}
                  className="aspect-[4/5] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg cursor-pointer hover:shadow-md transition-all flex flex-col items-center justify-center p-2 text-center group hover:scale-[1.02]"
                >
                  <p className="text-xs font-bold text-slate-700 mb-1 group-hover:text-primary">{idea.title}</p>
                  <p className="text-[10px] text-slate-500">{idea.subtitle}</p>
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
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase">Cor do Texto</label>
              <input type="color" value={mainTitleColor} onChange={(e) => setMainTitleColor(e.target.value)} className="h-10 w-full rounded-lg border-none p-0 cursor-pointer" />
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
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'square', icon: 'square' },
                  { name: 'circle', icon: 'circle' },
                  { name: 'triangle', icon: 'change_history' },
                  { name: 'star', icon: 'star' },
                  { name: 'hexagon', icon: 'hexagon' },
                  { name: 'diamond', icon: 'diamond' }
                ].map(shape => (
                  <button
                    key={shape.name}
                    onClick={() => handleAddShape(shape.name)}
                    className="aspect-square rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary hover:text-primary transition-colors hover:bg-white"
                  >
                    <span className="material-symbols-outlined">{shape.icon}</span>
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
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-colors gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-3xl">upload_file</span>
              <span className="text-sm font-medium">Fazer Upload</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileUpload}
              accept="image/*"
            />

            <div className="grid grid-cols-2 gap-2 mt-4">
              {uploadedFiles.map((url, i) => (
                <div
                  key={i}
                  onClick={() => handleAddImageToCanvas(url)}
                  className="aspect-square rounded-lg bg-slate-100 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all relative group"
                >
                  <img src={url} alt="upload" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100">add_circle</span>
                  </div>
                </div>
              ))}
            </div>
            {uploadedFiles.length === 0 && (
              <p className="text-xs text-slate-400 text-center">Seus uploads aparecerão aqui.</p>
            )}
          </div>
        );
      default:
        // Render simple placeholder for unimplemented panels
        return <div className="p-5"><p className="text-sm text-slate-500">Em breve...</p></div>;
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
        <aside
          className="w-[72px] bg-white border-r border-slate-200 flex flex-col items-center py-3 gap-1 shrink-0 z-10"
          onMouseLeave={handleMouseLeave}
        >
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => handlePanelClick(item.id)}
              onMouseEnter={() => handleMouseEnter(item.id)}
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
          <aside
            className="w-[280px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0 shadow-sm z-10"
            onMouseEnter={() => setActivePanel(activePanel)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="h-12 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => setIsPanelPinned(!isPanelPinned)}
                className={`text-slate-400 hover:text-slate-600 ${isPanelPinned ? 'text-primary' : ''}`}
                title="Fixar painel"
              >
                <span className="material-symbols-outlined text-lg">push_pin</span>
              </button>
              <button
                onClick={() => { setActivePanel(null); setIsPanelPinned(false); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            {renderPanelContent()}
          </aside>
        )}

        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col bg-slate-100 relative overflow-hidden">
          {/* Canvas Container */}
          <div
            ref={canvasContainerRef}
            className="flex-1 w-full h-full flex items-center justify-center p-8 overflow-hidden" // Added padding to prevent edge touching
          >
            {/* Scalable Wrapper */}
            <div
              style={{
                width: 400,
                height: 711,
                transform: `scale(${canvasScale})`,
                transformOrigin: 'center center',
                transition: 'transform 0.1s ease-out'
              }}
              className="relative bg-white shadow-2xl overflow-hidden rounded-sm shrink-0"
            >
              {/* Background Layer */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{
                  backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                  backgroundColor: backgroundImage ? undefined : undefined
                }}
              >
                <div className={`absolute inset-0 ${backgroundImage ? 'bg-black/30' : 'bg-gradient-to-br from-orange-400/80 to-blue-500/80'}`}></div>
              </div>

              {/* Elements Layer */}
              <div className="absolute inset-0 overflow-hidden">
                {elements.map(el => (
                  <div
                    key={el.id}
                    className={`absolute cursor-move group ${selectedId === el.id ? 'z-10' : 'z-0'}`}
                    style={{
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      height: el.height,
                    }}
                    onMouseDown={(e) => handleElementMouseDown(e, el.id)}
                  >
                    {/* Border & Handles when selected */}
                    {selectedId === el.id ? (
                      <>
                        <div className="absolute inset-0 border-2 border-primary pointer-events-none"></div>
                        {/* Resize Handles */}
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-primary rounded-full cursor-nw-resize pointer-events-auto" onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'nw')} />
                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-primary rounded-full cursor-ne-resize pointer-events-auto" onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'ne')} />
                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-primary rounded-full cursor-sw-resize pointer-events-auto" onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'sw')} />
                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-primary rounded-full cursor-se-resize pointer-events-auto" onMouseDown={(e) => handleResizeMouseDown(e, el.id, 'se')} />
                      </>
                    ) : (
                      <div className="absolute inset-0 border border-transparent group-hover:border-primary border-dashed pointer-events-none"></div>
                    )}

                    {el.type === 'shape' && (
                      <div
                        className="w-full h-full flex items-center justify-center pointer-events-none"
                        style={{ color: el.color }}
                      >
                        {/* Mapping simple shapes to Material Symbols for MVP */}
                        {el.content === 'square' && <div className="w-full h-full bg-current"></div>}
                        {el.content === 'circle' && <div className="w-full h-full rounded-full bg-current"></div>}
                        {el.content === 'triangle' && <span className="material-symbols-outlined w-full h-full flex items-center justify-center" style={{ fontSize: Math.min(el.width, el.height) }}>change_history</span>}
                        {el.content === 'star' && <span className="material-symbols-outlined w-full h-full flex items-center justify-center" style={{ fontSize: Math.min(el.width, el.height) }}>star</span>}
                        {['hexagon', 'diamond'].includes(el.content) && <span className="material-symbols-outlined w-full h-full flex items-center justify-center" style={{ fontSize: Math.min(el.width, el.height) }}>{el.content}</span>}
                      </div>
                    )}

                    {el.type === 'image' && (
                      <img src={el.content} alt="" className="w-full h-full object-cover rounded-sm pointer-events-none" />
                    )}
                  </div>
                ))}

                {/* Main Text Template (Static for now to serve as main layer) */}
                <div className="absolute inset-x-6 top-1/4 flex flex-col pointer-events-none">
                  <div className="bg-primary text-white text-[9px] font-bold uppercase py-1 px-2 rounded w-fit mb-3 pointer-events-auto">Novo Post</div>
                  <pre
                    contentEditable
                    suppressContentEditableWarning
                    className="font-black text-slate-900 leading-[1.1] mb-4 border-2 border-transparent hover:border-primary/50 border-dashed rounded cursor-text p-1 outline-none focus:border-primary pointer-events-auto whitespace-pre-wrap font-sans"
                    style={{ fontSize: '2.5rem', color: mainTitleColor }}
                  >
                    {mainTitle}
                  </pre>
                </div>

                <div className="absolute bottom-6 left-6 flex items-center gap-2 pointer-events-none">
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
