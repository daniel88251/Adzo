import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CreateAd } from './components/CreateAd';
import { AdAnalyzer } from './components/AdAnalyzer';
import { CampaignPlanner } from './components/CampaignPlanner';
import { BrandKit } from './components/BrandKit';
import { Inspiration } from './components/Inspiration';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { Subscription } from './components/Subscription';
import { AdChannels } from './components/AdChannels';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'studio':
        return <CreateAd />;
      case 'analyzer':
        return <AdAnalyzer />;
      case 'planner':
        return <CampaignPlanner />;
      case 'brandkit':
        return <BrandKit />;
      case 'inspiration':
        return <Inspiration />;
      case 'profile':
        return <Profile />;
      case 'subscription':
        return <Subscription />;
      case 'channels':
        return <AdChannels />;
      default:
        return <Dashboard />;
    }
  };

  const handleNav = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-50">
         <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-adzo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
           <span className="font-bold text-lg text-slate-800">AdZo</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 px-6 space-y-4 md:hidden overflow-y-auto">
           <button onClick={() => handleNav('profile')} className="block w-full text-left py-3 text-lg font-medium border-b border-slate-100">Meu Perfil</button>
           <button onClick={() => handleNav('subscription')} className="block w-full text-left py-3 text-lg font-medium border-b border-slate-100">Planos & Assinatura</button>
           <button onClick={() => handleNav('dashboard')} className="block w-full text-left py-3 text-lg font-medium border-b border-slate-100">Dashboard</button>
           <button onClick={() => handleNav('channels')} className="block w-full text-left py-3 text-lg font-medium border-b border-slate-100">Canais de Anúncios</button>
           <button onClick={() => handleNav('planner')} className="block w-full text-left py-3 text-lg font-medium border-b border-slate-100">Planejador</button>
           <button onClick={() => handleNav('studio')} className="block w-full text-left py-3 text-lg font-medium border-b border-slate-100">Estúdio Criativo</button>
           <button onClick={() => handleNav('analyzer')} className="block w-full text-left py-3 text-lg font-medium border-b border-slate-100">Analisador</button>
           <button onClick={() => handleNav('brandkit')} className="block w-full text-left py-3 text-lg font-medium border-b border-slate-100">Brand Kit</button>
           <button onClick={() => handleNav('inspiration')} className="block w-full text-left py-3 text-lg font-medium border-b border-slate-100">Inspiração</button>
           <button onClick={() => setIsAuthenticated(false)} className="block w-full text-left py-3 text-lg font-medium border-b border-slate-100 text-red-500">Sair</button>
        </div>
      )}

      {/* Main Content */}
      <main className="md:pl-64 min-h-screen transition-all duration-300">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;