import React, { useState, useRef, Suspense, lazy } from 'react';
import { AdFormat, Sector } from '../types';
import { generateAdCopy, generateAdImage, generateAdVideo, generateVideoScript } from '../services/geminiService';
import { Loader2, Type, Image as ImageIcon, Video, Wand2, Copy, Download, FileText, Upload, XCircle, Check } from 'lucide-react';

const VideoPreview = lazy(() => import('./VideoPreview'));

export const CreateAd: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdFormat>(AdFormat.TEXT);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Form States
  const [sector, setSector] = useState<Sector>(Sector.ECOMMERCE);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [visualPrompt, setVisualPrompt] = useState('');
  const [tone, setTone] = useState('');
  
  // New state for Video reference image
  const [videoRefImage, setVideoRefImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setVideoRefImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (activeTab === AdFormat.TEXT) {
        const copy = await generateAdCopy(productName, description, sector, targetAudience, tone);
        setResult(copy);
      } else if (activeTab === AdFormat.IMAGE) {
        const fullPrompt = `${visualPrompt || description}. Product: ${productName}. Sector: ${sector}. Professional advertising photography.`;
        const imageUrl = await generateAdImage(fullPrompt);
        setResult(imageUrl);
      } else if (activeTab === AdFormat.VIDEO) {
        const fullPrompt = `${visualPrompt || description}. Showcasing ${productName} for ${sector} sector. High quality commercial.`;
        // Pass the raw base64 data (stripping header) if image exists
        const imageBytes = videoRefImage ? videoRefImage.split(',')[1] : undefined;
        const videoUrl = await generateAdVideo(fullPrompt, "16:9", imageBytes);
        setResult(videoUrl);
      } else if (activeTab === AdFormat.SCRIPT) {
         const script = await generateVideoScript(productName, visualPrompt || description);
         setResult(script);
      }
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao gerar o conteúdo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoKeySelection = async () => {
    const win = window as any;
    if (win.aistudio && win.aistudio.openSelectKey) {
       try {
         await win.aistudio.openSelectKey();
       } catch (e) {
         console.error("Key selection failed", e);
       }
    } else {
        alert("Configuração de chave API indisponível neste ambiente.");
    }
  };

  const handleDownload = () => {
    if (!result) return;

    try {
        const timestamp = new Date().getTime();
        
        if (activeTab === AdFormat.TEXT) {
            const textContent = `HEADLINE:\n${result.headline}\n\nCORPO:\n${result.body}\n\nCTA:\n${result.cta}`;
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `adzo-copy-${timestamp}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (activeTab === AdFormat.IMAGE) {
            const a = document.createElement('a');
            a.href = result;
            a.download = `adzo-creative-${timestamp}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else if (activeTab === AdFormat.VIDEO) {
            const a = document.createElement('a');
            a.href = result;
            a.download = `adzo-video-${timestamp}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else if (activeTab === AdFormat.SCRIPT) {
            let scriptContent = `TÍTULO: ${result.title}\n\n`;
            result.scenes?.forEach((scene: any, idx: number) => {
                scriptContent += `CENA ${idx + 1}:\nVISUAL: ${scene.visual}\nÁUDIO: ${scene.audio}\n\n`;
            });
            const blob = new Blob([scriptContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `adzo-script-${timestamp}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    } catch (e) {
        console.error("Download failed", e);
        alert("Erro ao iniciar download.");
    }
  };

  const handleCopy = () => {
      if (!result) return;
      let textToCopy = "";
      
      if (activeTab === AdFormat.TEXT) {
        textToCopy = `HEADLINE:\n${result.headline}\n\nCORPO:\n${result.body}\n\nCTA:\n${result.cta}`;
      } else if (activeTab === AdFormat.SCRIPT) {
        textToCopy = `TÍTULO: ${result.title}\n\n`;
        result.scenes?.forEach((scene: any, idx: number) => {
            textToCopy += `CENA ${idx + 1}:\nVISUAL: ${scene.visual}\nÁUDIO: ${scene.audio}\n\n`;
        });
      } else {
        alert("A função copiar está disponível apenas para Textos e Roteiros. Use o botão de download para salvar imagens e vídeos.");
        return;
      }

      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Estúdio Criativo</h1>
        <p className="text-slate-500 mt-1">Sua fábrica de assets de alta conversão. Textos, imagens, roteiros e vídeos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex overflow-x-auto">
            {[
              { id: AdFormat.TEXT, icon: Type, label: 'Copy' },
              { id: AdFormat.IMAGE, icon: ImageIcon, label: 'Visual' },
              { id: AdFormat.SCRIPT, icon: FileText, label: 'Roteiro' },
              { id: AdFormat.VIDEO, icon: Video, label: 'Vídeo' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                   setActiveTab(tab.id);
                   setResult(null);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-adzo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5">
             {activeTab === AdFormat.VIDEO && (
                 <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-800">
                    <p className="mb-2 font-semibold">Nota para Vídeo:</p>
                    <p className="mb-3">A geração de vídeo requer uma chave API paga selecionada.</p>
                    <button 
                        onClick={handleVideoKeySelection}
                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors"
                    >
                        Selecionar Chave API
                    </button>
                 </div>
             )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Setor</label>
              <select 
                value={sector} 
                onChange={(e) => setSector(e.target.value as Sector)}
                className="w-full rounded-lg border-slate-200 focus:ring-adzo-500 focus:border-adzo-500 py-2.5 px-3 bg-slate-50"
              >
                {Object.values(Sector).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Produto/Serviço</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: Tênis Runner Pro"
                className="w-full rounded-lg border-slate-200 focus:ring-adzo-500 focus:border-adzo-500 py-2.5 px-3 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Benefícios principais..."
                rows={3}
                className="w-full rounded-lg border-slate-200 focus:ring-adzo-500 focus:border-adzo-500 py-2.5 px-3 bg-slate-50"
              />
            </div>

            {activeTab === AdFormat.TEXT && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Público Alvo</label>
                  <input 
                    type="text" 
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Ex: Jovens adultos..."
                    className="w-full rounded-lg border-slate-200 focus:ring-adzo-500 focus:border-adzo-500 py-2.5 px-3 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tom de Voz (Opcional)</label>
                  <input 
                    type="text" 
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    placeholder="Ex: Divertido, Sério..."
                    className="w-full rounded-lg border-slate-200 focus:ring-adzo-500 focus:border-adzo-500 py-2.5 px-3 bg-slate-50"
                  />
                </div>
              </>
            )}

            {(activeTab === AdFormat.IMAGE || activeTab === AdFormat.VIDEO || activeTab === AdFormat.SCRIPT) && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Direção Criativa / Prompt</label>
                <textarea 
                  value={visualPrompt}
                  onChange={(e) => setVisualPrompt(e.target.value)}
                  placeholder={activeTab === AdFormat.SCRIPT ? "Ângulo do vídeo (ex: unboxing, tutorial)" : "Cenário, luz, estilo..."}
                  rows={3}
                  className="w-full rounded-lg border-slate-200 focus:ring-adzo-500 focus:border-adzo-500 py-2.5 px-3 bg-slate-50"
                />
              </div>
            )}
            
            {activeTab === AdFormat.VIDEO && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Imagem de Referência (Opcional)</label>
                    {!videoRefImage ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 rounded-lg p-4 cursor-pointer hover:bg-slate-50 text-center"
                        >
                            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                            <span className="text-xs text-slate-500">Clique para upload (Img to Video)</span>
                        </div>
                    ) : (
                        <div className="relative inline-block">
                             <img src={videoRefImage} alt="Ref" className="h-20 w-auto rounded border border-slate-200" />
                             <button 
                                onClick={() => { setVideoRefImage(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                                className="absolute -top-2 -right-2 text-red-500 bg-white rounded-full p-0.5 shadow-sm"
                             >
                                 <XCircle className="w-4 h-4" />
                             </button>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !productName}
              className={`w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                loading || !productName 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-adzo-600 to-indigo-600 hover:shadow-lg hover:scale-[1.01]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Criar Agora
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2">
          <div className="bg-slate-50 border border-slate-200 rounded-xl h-full min-h-[600px] flex flex-col relative overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
              <h3 className="font-semibold text-slate-700">Preview</h3>
              {result && (
                <div className="flex gap-2">
                  <button 
                    onClick={handleCopy}
                    className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors" 
                    title="Copiar para área de transferência"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors" 
                    title="Baixar arquivo"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 p-8 flex items-center justify-center overflow-auto">
              {!result && !loading && (
                <div className="text-center text-slate-400">
                  <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Preencha os detalhes e clique em gerar para ver a mágica acontecer.</p>
                </div>
              )}

              {loading && (
                <div className="text-center">
                  <div className="inline-block relative">
                    <div className="w-16 h-16 border-4 border-adzo-100 border-t-adzo-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="mt-4 text-adzo-600 font-medium">IA trabalhando...</p>
                  {activeTab === AdFormat.VIDEO && <p className="text-xs text-slate-400 mt-2">Vídeos podem levar alguns minutos.</p>}
                </div>
              )}

              {result && activeTab === AdFormat.TEXT && (
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md border border-slate-100">
                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Headline</span>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">{result.headline}</h2>
                  </div>
                  <div className="mb-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corpo</span>
                    <p className="text-slate-600 mt-1 leading-relaxed">{result.body}</p>
                  </div>
                  <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors">
                    {result.cta}
                  </button>
                </div>
              )}

              {result && activeTab === AdFormat.IMAGE && (
                <div className="relative group max-w-lg shadow-xl rounded-lg overflow-hidden">
                  <img src={result} alt="Generated Ad" className="w-full h-auto" />
                </div>
              )}

              {result && activeTab === AdFormat.VIDEO && (
                <Suspense fallback={
                  <div className="w-full max-w-lg aspect-video bg-slate-200 animate-pulse rounded-lg flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                  </div>
                }>
                  <VideoPreview src={result} />
                </Suspense>
              )}
              
              {result && activeTab === AdFormat.SCRIPT && (
                  <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md border border-slate-100 font-mono text-sm">
                      <h2 className="text-lg font-bold mb-6 text-center border-b pb-4">{result.title}</h2>
                      <div className="space-y-6">
                          {result.scenes?.map((scene: any, idx: number) => (
                              <div key={idx} className="grid grid-cols-12 gap-4">
                                  <div className="col-span-1 font-bold text-slate-400">0{idx + 1}</div>
                                  <div className="col-span-5 text-slate-800">
                                      <span className="text-xs font-bold text-slate-400 block mb-1">VISUAL</span>
                                      {scene.visual}
                                  </div>
                                  <div className="col-span-6 text-slate-600 bg-slate-50 p-2 rounded">
                                      <span className="text-xs font-bold text-slate-400 block mb-1">ÁUDIO/LEGENDA</span>
                                      {scene.audio}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};