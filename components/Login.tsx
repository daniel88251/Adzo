import React, { useState } from 'react';
import { countries, Country } from '../utils/countries';
import { ChevronDown, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find(c => c.code === 'BR') || countries[0]
  );
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[448px] p-10 flex flex-col items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-2 text-adzo-600 mb-6">
           <div className="w-10 h-10 bg-adzo-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">A</div>
           <span className="font-bold text-2xl tracking-tight text-slate-800">AdZo</span>
        </div>

        <h2 className="text-2xl font-normal text-slate-900 mb-2">
          {isSignup ? 'Criar sua conta AdZo' : 'Fazer login'}
        </h2>
        <p className="text-slate-600 mb-8 text-center">
          {isSignup ? 'Comece a otimizar seus anúncios hoje' : 'Ir para a AdZo Agency'}
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {isSignup && (
            <div className="relative">
              <input
                type="text"
                id="fullname"
                className="peer w-full border border-slate-300 rounded-md px-3 py-3 text-slate-900 placeholder-transparent focus:outline-none focus:border-adzo-600 focus:ring-1 focus:ring-adzo-600 transition-all"
                placeholder="Nome Completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <label 
                htmlFor="fullname"
                className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-adzo-600"
              >
                Nome Completo
              </label>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              id="email"
              className="peer w-full border border-slate-300 rounded-md px-3 py-3 text-slate-900 placeholder-transparent focus:outline-none focus:border-adzo-600 focus:ring-1 focus:ring-adzo-600 transition-all"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label 
              htmlFor="email"
              className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-adzo-600"
            >
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              className="peer w-full border border-slate-300 rounded-md px-3 py-3 text-slate-900 placeholder-transparent focus:outline-none focus:border-adzo-600 focus:ring-1 focus:ring-adzo-600 transition-all"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label 
              htmlFor="password"
              className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-adzo-600"
            >
              Senha
            </label>
          </div>

          {isSignup && (
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 relative">
                <select
                  className="w-full border border-slate-300 rounded-md py-3 pl-2 pr-6 text-slate-900 focus:outline-none focus:border-adzo-600 focus:ring-1 focus:ring-adzo-600 appearance-none bg-white text-sm"
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const country = countries.find(c => c.code === e.target.value);
                    if (country) setSelectedCountry(country);
                  }}
                >
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.dial_code})
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-3.5 pointer-events-none text-slate-500">
                   <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              <div className="col-span-2 relative">
                <input
                  type="tel"
                  id="phone"
                  className="peer w-full border border-slate-300 rounded-md px-3 py-3 text-slate-900 placeholder-transparent focus:outline-none focus:border-adzo-600 focus:ring-1 focus:ring-adzo-600 transition-all"
                  placeholder="Telefone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                 <label 
                  htmlFor="phone"
                  className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-slate-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-adzo-600"
                >
                  Telefone
                </label>
              </div>
            </div>
          )}

          {!isSignup && (
            <div className="text-right">
              <a href="#" className="text-sm font-medium text-adzo-600 hover:text-adzo-800">
                Esqueceu a senha?
              </a>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={toggleMode}
              className="text-adzo-600 font-medium text-sm hover:bg-blue-50 px-3 py-2 rounded transition-colors"
            >
              {isSignup ? 'Fazer login em vez disso' : 'Criar conta'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-adzo-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-adzo-700 transition-all shadow-sm flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignup ? 'Cadastrar' : 'Próxima')}
            </button>
          </div>
        </form>
      </div>

      <div className="fixed bottom-4 text-xs text-slate-400 flex gap-4">
        <a href="#" className="hover:text-slate-600">Ajuda</a>
        <a href="#" className="hover:text-slate-600">Privacidade</a>
        <a href="#" className="hover:text-slate-600">Termos</a>
      </div>
    </div>
  );
};