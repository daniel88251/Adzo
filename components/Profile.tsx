import React, { useState } from 'react';
import { countries, Country } from '../utils/countries';
import { User, Mail, Phone, Globe, Shield, CheckCircle2, Loader2, Save, Building, AlertCircle } from 'lucide-react';

export const Profile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  
  // User State
  const [user, setUser] = useState({
    name: "Alex Designer",
    email: "alex@adzo.agency",
    phone: "11999999999",
    company: "AdZo Inc.",
    countryCode: "BR",
    isEmailVerified: false
  });

  const selectedCountry = countries.find(c => c.code === user.countryCode) || countries[0];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser({ ...user, countryCode: e.target.value });
  };

  const handleVerifyEmail = () => {
    setVerifyingEmail(true);
    // Simulate verification process
    setTimeout(() => {
      setUser(prev => ({ ...prev, isEmailVerified: true }));
      setVerifyingEmail(false);
    }, 2000);
  };

  const isGmail = user.email.toLowerCase().endsWith('@gmail.com');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Meu Perfil</h1>
        <p className="text-slate-500 mt-1">Gerencie suas informações pessoais e preferências de conta.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-adzo-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500 text-sm mb-4">{user.company}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
              <Shield className="w-3 h-3" /> Conta Segura
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-adzo-600" /> Regional
             </h3>
             <div className="space-y-4">
                <div>
                   <p className="text-xs text-slate-400 uppercase font-bold">País</p>
                   <p className="text-slate-700 font-medium flex items-center gap-2">
                      <span className="text-lg">{selectedCountry.code.replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))}</span>
                      {selectedCountry.name}
                   </p>
                </div>
                <div>
                   <p className="text-xs text-slate-400 uppercase font-bold">Idioma Nacional</p>
                   <p className="text-slate-700 font-medium">{selectedCountry.language}</p>
                </div>
                <div>
                   <p className="text-xs text-slate-400 uppercase font-bold">DDI</p>
                   <p className="text-slate-700 font-medium">{selectedCountry.dial_code}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="md:col-span-2">
           <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
                 <User className="w-5 h-5 text-adzo-600" /> Informações Pessoais
              </h3>

              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                       <div className="relative">
                          <input 
                             type="text" 
                             value={user.name} 
                             onChange={(e) => setUser({...user, name: e.target.value})}
                             className="w-full pl-10 pr-3 py-2 rounded-lg border-slate-200 focus:ring-adzo-500 bg-slate-50"
                          />
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Empresa</label>
                       <div className="relative">
                          <input 
                             type="text" 
                             value={user.company} 
                             onChange={(e) => setUser({...user, company: e.target.value})}
                             className="w-full pl-10 pr-3 py-2 rounded-lg border-slate-200 focus:ring-adzo-500 bg-slate-50"
                          />
                          <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                       </div>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <div className="relative">
                       <input 
                          type="email" 
                          value={user.email} 
                          onChange={(e) => setUser({...user, email: e.target.value, isEmailVerified: false})}
                          className={`w-full pl-10 pr-32 py-2 rounded-lg border focus:ring-adzo-500 bg-slate-50 ${user.isEmailVerified ? 'border-green-200 bg-green-50/30' : 'border-slate-200'}`}
                       />
                       <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                       
                       <div className="absolute right-2 top-1.5">
                          {user.isEmailVerified ? (
                             <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-white px-2 py-1 rounded border border-emerald-100 shadow-sm">
                                <CheckCircle2 className="w-3 h-3" /> Verificado
                             </span>
                          ) : (
                             isGmail ? (
                                <button 
                                   onClick={handleVerifyEmail}
                                   disabled={verifyingEmail}
                                   className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
                                >
                                   {verifyingEmail ? <Loader2 className="w-3 h-3 animate-spin" /> : "Verificar Gmail"}
                                </button>
                             ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded">
                                   <AlertCircle className="w-3 h-3" /> Não Verificado
                                </span>
                             )
                          )}
                       </div>
                    </div>
                    {isGmail && !user.isEmailVerified && (
                        <p className="text-xs text-slate-500 mt-1 ml-1">Utilize a verificação rápida do Google para proteger sua conta.</p>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">País de Residência</label>
                       <select 
                          value={user.countryCode} 
                          onChange={handleCountryChange}
                          className="w-full pl-3 pr-8 py-2 rounded-lg border-slate-200 focus:ring-adzo-500 bg-slate-50"
                       >
                          {countries.map(c => (
                             <option key={c.code} value={c.code}>{c.name}</option>
                          ))}
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                       <div className="relative">
                          <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-medium border-r border-slate-300 pr-2">
                             {selectedCountry.dial_code}
                          </span>
                          <input 
                             type="tel" 
                             value={user.phone} 
                             onChange={(e) => setUser({...user, phone: e.target.value})}
                             className="w-full pl-16 pr-3 py-2 rounded-lg border-slate-200 focus:ring-adzo-500 bg-slate-50"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                 <button className="bg-adzo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-adzo-700 transition-all shadow-sm flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};