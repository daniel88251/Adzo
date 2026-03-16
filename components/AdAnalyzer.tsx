import React, { useState, useRef } from 'react';
import { analyzeCreative } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { Upload, CheckCircle, AlertTriangle, RefreshCw, Loader2, Lightbulb } from 'lucide-react';

export const AdAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix for API
        setImage(base64);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // Pass only the base64 data, stripping prefix
      const base64Data = image.split(',')[1];
      const data = await analyzeCreative(base64Data);
      setResult(data);
    } catch (e) {
      alert("Erro na análise.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analisador de Anúncios</h1>
        <p className="text-slate-500 mt-1">Diagnóstico profissional de criativos com sugestões de otimização instantâneas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
            {!image ? (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-12 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Clique para fazer upload do criativo</p>
                    <p className="text-xs text-slate-400 mt-2">JPG, PNG até 5MB</p>
                </div>
            ) : (
                <div className="relative group">
                    <img src={image} alt="Upload" className="rounded-lg shadow-md max-h-[400px] mx-auto" />
                    <button 
                        onClick={() => { setImage(null); setResult(null); }}
                        className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow-sm hover:bg-red-50 text-red-500"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            
            {image && !result && (
                <button 
                    onClick={runAnalysis}
                    disabled={loading}
                    className="mt-6 w-full bg-adzo-600 text-white py-3 rounded-lg font-semibold hover:bg-adzo-700 transition-colors flex justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Iniciar Diagnóstico IA"}
                </button>
            )}
        </div>

        {result && (
            <div className="space-y-8 animate-slide-up">
                {/* Score Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-slate-900">AdZo Score</h3>
                        <p className="text-slate-500">Diagnóstico de design, copy e potencial de conversão</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-slate-100"
                                />
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                                    className={`${result.score > 70 ? 'text-green-500' : result.score > 40 ? 'text-orange-500' : 'text-red-500'} transition-all duration-1000`}
                                />
                            </svg>
                            <span className="absolute text-2xl font-bold text-slate-800">{result.score}</span>
                        </div>
                    </div>
                </div>

                {/* Detailed Analysis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Strengths */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-green-500">
                        <div className="flex items-center gap-2 mb-4 text-green-700">
                            <CheckCircle className="w-5 h-5" />
                            <h4 className="font-bold uppercase tracking-wider text-[10px]">Pontos Fortes</h4>
                        </div>
                        <ul className="space-y-3">
                            {result.strengths.map((s, i) => (
                                <li key={i} className="flex gap-2 text-sm text-slate-600">
                                    <span className="text-green-500 font-bold">•</span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-red-500">
                        <div className="flex items-center gap-2 mb-4 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            <h4 className="font-bold uppercase tracking-wider text-[10px]">Pontos Fracos</h4>
                        </div>
                        <ul className="space-y-3">
                            {result.weaknesses.map((s, i) => (
                                <li key={i} className="flex gap-2 text-sm text-slate-600">
                                    <span className="text-red-500 font-bold">•</span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-blue-500">
                        <div className="flex items-center gap-2 mb-4 text-blue-600">
                            <Lightbulb className="w-5 h-5" />
                            <h4 className="font-bold uppercase tracking-wider text-[10px]">Sugestões</h4>
                        </div>
                        <ul className="space-y-3">
                            {result.suggestions.map((s, i) => (
                                <li key={i} className="flex gap-2 text-sm text-slate-600">
                                    <span className="text-blue-500 font-bold">•</span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                {/* Improved Prompt */}
                {result.improvedVersionPrompt && (
                    <div className="bg-gradient-to-r from-indigo-600 to-adzo-600 p-8 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <RefreshCw className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Versão Otimizada</h4>
                                <p className="text-white/70 text-sm">Prompt sugerido para recriar este anúncio com IA</p>
                            </div>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                            <p className="text-sm italic leading-relaxed">"{result.improvedVersionPrompt}"</p>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};