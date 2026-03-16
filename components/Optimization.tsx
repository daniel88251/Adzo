import React, { useState } from 'react';
import { Sector } from '../types';
import { analyzeAndOptimize } from '../services/geminiService';
import { ArrowRight, Lightbulb, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Optimization: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    // Simulate analyzing E-commerce sector with average CTR
    const results = await analyzeAndOptimize(Sector.ECOMMERCE, 1.2);
    setSuggestions(results);
    setAnalyzed(true);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
       <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Otimização Inteligente</h1>
          <p className="text-slate-500 mt-1">Nossa IA analisa a performance e sugere melhorias baseadas em dados.</p>
        </div>
        {!analyzed && (
            <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-adzo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-adzo-700 transition-colors flex items-center gap-2"
            >
                {loading ? 'Analisando...' : 'Iniciar Análise da Conta'}
                {!loading && <TrendingUp className="w-5 h-5" />}
            </button>
        )}
      </div>

      {!analyzed && !loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Descubra onde melhorar</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                  A IA do AdZo vai escanear suas campanhas ativas e comparar com benchmarks do setor de E-commerce.
              </p>
          </div>
      )}

      {loading && (
          <div className="space-y-4">
              {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse">
                      <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  </div>
              ))}
          </div>
      )}

      {analyzed && (
        <div className="grid grid-cols-1 gap-6">
            {suggestions.map((suggestion, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <span className={`p-2 rounded-lg ${
                                    suggestion.category === 'Copy' ? 'bg-blue-100 text-blue-700' :
                                    suggestion.category === 'Visual' ? 'bg-purple-100 text-purple-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {suggestion.category === 'Copy' && <AlertCircle className="w-5 h-5" />}
                                    {suggestion.category === 'Visual' && <Lightbulb className="w-5 h-5" />}
                                    {suggestion.category === 'Audience' && <TrendingUp className="w-5 h-5" />}
                                </span>
                                <div>
                                    <h3 className="font-bold text-slate-800">Sugestão de {suggestion.category}</h3>
                                    <span className="text-xs text-slate-500 font-medium">Impacto Estimado: <span className="text-emerald-600">+{suggestion.impactScore}% na conversão</span></span>
                                </div>
                            </div>
                            <button className="text-sm font-medium text-adzo-600 hover:text-adzo-800 flex items-center gap-1">
                                Aplicar Automaticamente <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <p className="text-slate-600 text-sm mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                            {suggestion.reasoning}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg border border-red-100 bg-red-50/50">
                                <span className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1 block">Atual</span>
                                <p className="font-medium text-slate-700">{suggestion.currentValue}</p>
                            </div>
                            <div className="p-4 rounded-lg border border-green-100 bg-green-50/50 relative">
                                <div className="absolute -top-3 -right-3 bg-green-500 text-white p-1 rounded-full shadow-sm">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1 block">Sugerido (IA)</span>
                                <p className="font-medium text-slate-800">{suggestion.suggestedValue}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};