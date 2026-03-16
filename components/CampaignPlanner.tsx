import React, { useState } from 'react';
import { generateCampaignStrategy } from '../services/geminiService';
import { CampaignStrategy, Sector } from '../types';
import { Loader2, Target, Calendar, PieChart, Users } from 'lucide-react';

export const CampaignPlanner: React.FC = () => {
  const [product, setProduct] = useState('');
  const [goal, setGoal] = useState('');
  const [budget, setBudget] = useState('');
  const [sector, setSector] = useState(Sector.ECOMMERCE);
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<CampaignStrategy | null>(null);

  const handlePlan = async () => {
    setLoading(true);
    try {
      const result = await generateCampaignStrategy(product, goal, budget, sector);
      setStrategy(result);
    } catch (e) {
      alert("Erro ao gerar plano.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Planejador de Campanhas</h1>
        <p className="text-slate-500 mt-1">Defina seus objetivos e receba um plano de mídia completo em segundos.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Produto/Serviço</label>
                <input value={product} onChange={e => setProduct(e.target.value)} className="w-full rounded-lg border-slate-200 py-2 px-3 bg-slate-50" placeholder="Ex: Curso de Inglês" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Setor</label>
                <select value={sector} onChange={e => setSector(e.target.value as Sector)} className="w-full rounded-lg border-slate-200 py-2 px-3 bg-slate-50">
                    {Object.values(Sector).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Objetivo Principal</label>
                <input value={goal} onChange={e => setGoal(e.target.value)} className="w-full rounded-lg border-slate-200 py-2 px-3 bg-slate-50" placeholder="Ex: Gerar Leads Qualificados" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Orçamento Mensal</label>
                <input value={budget} onChange={e => setBudget(e.target.value)} className="w-full rounded-lg border-slate-200 py-2 px-3 bg-slate-50" placeholder="Ex: R$ 5.000,00" />
            </div>
        </div>
        <div className="md:col-span-4">
            <button 
                onClick={handlePlan} 
                disabled={loading || !product}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all flex justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Target className="w-5 h-5" />}
                Gerar Estratégia Completa
            </button>
        </div>
      </div>

      {strategy && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-800">Público-Alvo</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Demografia</span>
                        <p className="text-slate-700">{strategy.targetAudience.demographics}</p>
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Dores & Desejos</span>
                        <ul className="list-disc list-inside text-slate-600 text-sm mt-1">
                            {strategy.targetAudience.painPoints.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                    <PieChart className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-800">Mix de Canais & Orçamento</h3>
                </div>
                <div className="space-y-3">
                    {strategy.budgetAllocation.map((item, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700">{item.channel}</span>
                                <span className="text-slate-500">{item.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5">
                                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-slate-800">Calendário de Conteúdo (4 Semanas)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {strategy.contentCalendar.map((week, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <span className="text-xs font-bold text-orange-600 uppercase mb-2 block">Semana {week.week}</span>
                            <h4 className="font-medium text-slate-800 text-sm mb-2">{week.theme}</h4>
                            <div className="flex flex-wrap gap-1">
                                {week.formats.map((fmt, i) => (
                                    <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">{fmt}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};