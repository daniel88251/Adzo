import React from 'react';
import { 
  LayoutDashboard, 
  Palette, 
  Zap, 
  BarChart2, 
  Briefcase, 
  Lightbulb,
  Settings, 
  LogOut,
  User,
  CreditCard,
  Share2
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout }) => {
  const menuItems = [
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'subscription', label: 'Planos & Assinatura', icon: CreditCard },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'channels', label: 'Canais de Anúncios', icon: Share2 },
    { id: 'planner', label: 'Planejador de Campanha', icon: Briefcase },
    { id: 'studio', label: 'Estúdio Criativo', icon: Palette },
    { id: 'analyzer', label: 'Analisador de Ads', icon: BarChart2 },
    { id: 'inspiration', label: 'Inspiração & Trends', icon: Lightbulb },
    { id: 'brandkit', label: 'Brand Kit IA', icon: Zap },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-slate-200 flex flex-col fixed left-0 top-0 hidden md:flex z-50">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 text-adzo-600">
           <div className="w-8 h-8 bg-adzo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
           <span className="font-bold text-xl tracking-tight text-slate-800">AdZo</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">Sua Agência de IA</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === item.id
                ? 'bg-adzo-50 text-adzo-600 border border-adzo-100'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <Settings className="w-5 h-5" />
          Configurações
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </div>
  );
};