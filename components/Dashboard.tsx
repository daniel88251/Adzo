import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Activity, TrendingUp, Users, DollarSign, Sparkles } from 'lucide-react';

const data = [
  { name: 'Seg', ctr: 1.2, conv: 0.8, spend: 120 },
  { name: 'Ter', ctr: 1.5, conv: 1.1, spend: 132 },
  { name: 'Qua', ctr: 1.8, conv: 1.3, spend: 101 },
  { name: 'Qui', ctr: 2.2, conv: 1.8, spend: 154 },
  { name: 'Sex', ctr: 2.0, conv: 1.9, spend: 190 },
  { name: 'Sab', ctr: 2.8, conv: 2.4, spend: 230 },
  { name: 'Dom', ctr: 2.6, conv: 2.2, spend: 210 },
];

const StatCard: React.FC<{ 
  title: string; 
  value: string; 
  trend: string; 
  icon: React.ReactNode; 
  color: string 
}> = ({ title, value, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-2 inline-block ${
        trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {trend} vs semana passada
      </span>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-900 to-adzo-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium mb-4 backdrop-blur-sm border border-white/10">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                Agência IA Ativa
            </div>
            <h1 className="text-3xl font-bold mb-2">Bem-vindo à AdZo Agency</h1>
            <p className="text-slate-300 max-w-xl text-lg">
                Uma única plataforma que cria, analisa e otimiza anúncios completos — imagens, textos, vídeos e campanhas.
            </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-adzo-500/20 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Gasto Total" 
          value="R$ 1.240,00" 
          trend="+12%" 
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />} 
          color="bg-emerald-50"
        />
        <StatCard 
          title="CTR Médio" 
          value="2.4%" 
          trend="+0.8%" 
          icon={<Activity className="w-6 h-6 text-blue-600" />} 
          color="bg-blue-50"
        />
        <StatCard 
          title="Conversões" 
          value="142" 
          trend="+24%" 
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />} 
          color="bg-purple-50"
        />
        <StatCard 
          title="Impressões" 
          value="45.2k" 
          trend="+5%" 
          icon={<Users className="w-6 h-6 text-orange-600" />} 
          color="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Performance da Semana</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="conv" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorConv)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">CTR vs Gasto</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="ctr" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} />
                <Line yAxisId="right" type="monotone" dataKey="spend" stroke="#10b981" strokeWidth={3} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};