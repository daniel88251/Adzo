import React, { useState } from 'react';
import { generateBrandKit } from '../services/geminiService';
import { BrandProfile } from '../types';
import { Loader2, Sparkles, Copy } from 'lucide-react';

export const BrandKit: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<BrandProfile | null>(null);

  const handleGenerate = async () => {
    if (!brandName || !description) return;
    setLoading(true);
    try {
      const result = await generateBrandKit(brandName, description);
      setProfile(result);
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar Brand Kit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Brand Kit IA</h1>
        <p className="text-slate-500 mt-1">Defina a alma da sua marca. A IA garante consistência em todos os seus anúncios.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Marca</label>
            <input 
              type="text" 
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full rounded-lg border-slate-200 focus:ring-adzo-500 py-2 px-3 bg-slate-50"
              placeholder="Ex: EcoWear"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">O que a marca faz?</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border-slate-200 focus:ring-adzo-500 py-2 px-3 bg-slate-50"
              placeholder="Ex: Roupas sustentáveis para jovens aventureiros"
            />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || !brandName || !description}
          className="w-full bg-adzo-600 text-white py-3 rounded-lg font-semibold hover:bg-adzo-700 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Gerar Identidade Visual e Verbal
        </button>
      </div>

      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Paleta de Cores</h3>
            <div className="space-y-3">
              {profile.colors.map((color, idx) => (
                <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                  <div 
                    className="w-16 h-16 rounded-lg shadow-sm border border-slate-100" 
                    style={{ backgroundColor: color }}
                  ></div>
                  <div>
                    <p className="font-mono text-slate-600 font-medium">{color}</p>
                    <span className="text-xs text-slate-400 group-hover:text-adzo-500 transition-colors">Clique para copiar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Tom de Voz</h3>
              <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">{profile.toneOfVoice}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Tipografia Sugerida</h3>
              <p className="text-slate-800 font-medium">{profile.typography}</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-gradient-to-br from-adzo-900 to-slate-900 p-8 rounded-xl text-white shadow-lg">
             <h3 className="text-xs font-bold uppercase tracking-widest text-adzo-400 mb-2">Manifesto da Marca</h3>
             <p className="text-2xl font-serif italic leading-relaxed opacity-90">"{profile.manifesto}"</p>
          </div>
        </div>
      )}
    </div>
  );
};