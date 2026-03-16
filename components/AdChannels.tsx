import React, { useState } from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Globe, Share2, CheckCircle2, Link2, Loader2, Video } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  icon: React.ElementType;
  connected: boolean;
  accountName?: string;
  color: string;
}

export const AdChannels: React.FC = () => {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [channels, setChannels] = useState<Channel[]>([
    { id: 'facebook', name: 'Facebook Ads', icon: Facebook, connected: true, accountName: 'AdZo Business', color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram Ads', icon: Instagram, connected: true, accountName: '@adzo.agency', color: 'bg-gradient-to-tr from-yellow-500 to-purple-600' },
    { id: 'google', name: 'Google Ads', icon: Globe, connected: false, color: 'bg-red-500' },
    { id: 'tiktok', name: 'TikTok Ads', icon: Video, connected: false, color: 'bg-black' },
    { id: 'youtube', name: 'YouTube Ads', icon: Youtube, connected: false, color: 'bg-red-600' },
    { id: 'linkedin', name: 'LinkedIn Ads', icon: Linkedin, connected: false, color: 'bg-blue-700' },
  ]);

  const toggleConnection = (id: string) => {
    setConnecting(id);
    // Simulate API delay
    setTimeout(() => {
      setChannels(prev => prev.map(channel => {
        if (channel.id === id) {
          return {
            ...channel,
            connected: !channel.connected,
            accountName: !channel.connected ? 'Conta Conectada' : undefined
          };
        }
        return channel;
      }));
      setConnecting(null);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Canais de Anúncios</h1>
        <p className="text-slate-500 mt-1">Conecte suas plataformas de mídia para publicar e analisar campanhas automaticamente.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <div key={channel.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${channel.color}`}>
                  <channel.icon className="w-6 h-6" />
                </div>
                {channel.connected && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3" /> Ativo
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1">{channel.name}</h3>
              <p className="text-sm text-slate-500 min-h-[20px]">
                {channel.connected ? channel.accountName : 'Não conectado'}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <button
                  onClick={() => toggleConnection(channel.id)}
                  disabled={!!connecting}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    channel.connected
                      ? 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {connecting === channel.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : channel.connected ? (
                    'Desconectar'
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" /> Conectar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
           <h3 className="text-lg font-bold text-indigo-900 mb-2">Precisa de mais integrações?</h3>
           <p className="text-indigo-700/80">
             O plano Enterprise permite conexões personalizadas via API e integrações com CRMs como Salesforce e HubSpot.
           </p>
        </div>
        <button className="whitespace-nowrap bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
           Falar com Suporte
        </button>
      </div>
    </div>
  );
};