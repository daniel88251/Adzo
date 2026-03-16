import React, { useState } from 'react';
import { Sector } from '../types';
import { getSectorTrends } from '../services/geminiService';
import { Lightbulb, Loader2, ArrowRight } from 'lucide-react';

export const Inspiration: React.FC = () => {
  const [sector, setSector] = useState<Sector>(Sector.ECOMMERCE);
  const [trends, setTrends] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const data = await getSectorTrends(sector);
      setTrends(data);
    } catch (e) {
      alert("Erro ao buscar trends.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">Biblioteca de Referências</h1>
        <p className="text-slate-500 mt-2">Descubra o que está funcionando agora no seu mercado. Nossa IA monitora padrões de alta performance.</p>
      </div>

      <div className="flex justify-center gap-4">
        <select 
            value={sector} 
            onChange={(e) => setSector(e.target.value as Sector)}
            className="rounded-lg border-slate-200 shadow-sm py-3 px-4 bg-white focus:ring-adzo-500"
        >
            {Object.values(Sector).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button 
            onClick={fetchTrends}
            disabled={loading}
            className="bg-adzo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-adzo-700 transition-colors"
        >
            {loading ? <Loader2 className="animate-spin" /> : "Descobrir Trends"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {trends.length > 0 ? (
            trends.map((trend, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-start gap-4">
                        <div className="bg-yellow-50 p-3 rounded-lg text-yellow-600 group-hover:bg-yellow-100 transition-colors">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-2">Trend #{idx + 1}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{trend}</p>
                        </div>
                    </div>
                </div>
            ))
        ) : !loading && (
            <div className="md:col-span-2 text-center py-20 bg-white rounded-xl border border-slate-100 border-dashed">
                <p className="text-slate-400">Selecione um setor para ver as tendências.</p>
            </div>
        )}
      </div>
    </div>
  );
};