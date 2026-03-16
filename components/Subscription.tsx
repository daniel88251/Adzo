import React, { useState } from 'react';
import { Check, X, CreditCard, Star, Zap, Briefcase, Building, Loader2, ShieldCheck, Clock } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  color: string;
  icon: React.ElementType;
  popular?: boolean;
}

export const Subscription: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 37,
      period: '/mês',
      description: 'Para iniciantes e pequenos negócios.',
      color: 'bg-blue-500',
      icon: Star,
      features: [
        '50 gerações de criativos/mês',
        'Geração de copy limitada',
        '5 vídeos curtos/mês',
        'Biblioteca de referências',
        'Suporte por email'
      ],
      notIncluded: [
        'Análise profunda de Ads',
        'Brand Kit IA',
        'Exportação em massa'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 97,
      period: '/mês',
      description: 'O favorito de gestores e afiliados.',
      color: 'bg-adzo-600',
      icon: Zap,
      popular: true,
      features: [
        'Criativos Ilimitados',
        'Copy Ilimitada',
        '50 vídeos/mês',
        'Analisador de Anúncios',
        'Planejador de Campanhas',
        'Brand Kit IA Completo',
        'Suporte Prioritário'
      ]
    },
    {
      id: 'agency',
      name: 'Agency',
      price: 297,
      period: '/mês',
      description: 'Para agências e alta escala.',
      color: 'bg-purple-600',
      icon: Briefcase,
      features: [
        'Tudo do Pro',
        '150+ vídeos/mês',
        'Workspace para 5 usuários',
        'Exportação em massa',
        'Pastas de Marcas',
        'Insights em Tempo Real',
        'Licença Comercial Estendida'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 0, // Custom
      period: '',
      description: 'Para grandes redes e franquias.',
      color: 'bg-slate-800',
      icon: Building,
      features: [
        'IA Personalizada (Treinada)',
        'Usuários Ilimitados',
        'Gerente de Conta Dedicado',
        'Acesso à API',
        'Integrações Avançadas',
        'SLA Garantido'
      ]
    }
  ];

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === 'enterprise') {
      window.location.href = "mailto:sales@adzo.agency?subject=Enterprise Inquiry";
      return;
    }
    setSelectedPlan(plan);
    setShowCheckout(true);
    setSuccess(false);
  };

  const handlePayment = () => {
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        setShowCheckout(false);
        // Here you would typically update the global user context state
      }, 2000);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Escolha o plano ideal para escalar</h1>
        <p className="text-lg text-slate-500">
          Desbloqueie todo o poder da IA. Crie, analise e otimize sem limites. 
          <br />
          <span className="text-adzo-600 font-bold bg-adzo-50 px-2 py-0.5 rounded-md mt-2 inline-block">Comece com 3 dias grátis nos planos pagos.</span>
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center mt-8 gap-4">
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>Mensal</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-7 bg-slate-200 rounded-full relative transition-colors focus:outline-none"
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-all ${billingCycle === 'monthly' ? 'left-1' : 'left-8 bg-adzo-600'}`}></div>
          </button>
          <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
            Anual <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full ml-1">-20% OFF</span>
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative flex flex-col p-6 bg-white rounded-2xl border transition-all hover:shadow-xl ${
              plan.popular 
                ? 'border-adzo-500 shadow-lg scale-105 z-10' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-adzo-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                MAIS POPULAR
              </div>
            )}

            <div className="mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 ${plan.color}`}>
                <plan.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="text-slate-500 text-sm mt-1 min-h-[40px]">{plan.description}</p>
            </div>

            <div className="mb-6">
              {plan.price > 0 ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900">R$ {billingCycle === 'yearly' ? Math.floor(plan.price * 0.8) : plan.price}</span>
                    <span className="text-slate-500">{plan.period}</span>
                  </div>
                   <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3" />
                      3 dias teste grátis
                  </div>
                </>
              ) : (
                <span className="text-3xl font-bold text-slate-900">Consulta</span>
              )}
              {billingCycle === 'yearly' && plan.price > 0 && (
                <p className="text-xs text-emerald-600 font-medium mt-1">Economize R$ {Math.floor(plan.price * 12 * 0.2)}/ano</p>
              )}
            </div>

            <div className="flex-1 space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-adzo-600' : 'text-slate-400'}`} />
                  <span>{feature}</span>
                </div>
              ))}
              {plan.notIncluded?.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-400 opacity-60">
                  <X className="w-5 h-5 shrink-0" />
                  <span className="line-through decoration-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan(plan)}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                plan.popular 
                  ? 'bg-adzo-600 text-white hover:bg-adzo-700 shadow-md hover:shadow-lg' 
                  : plan.id === 'enterprise'
                    ? 'bg-slate-800 text-white hover:bg-slate-900'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {plan.id === 'enterprise' ? 'Falar com Consultor' : `Testar Grátis (${plan.name})`}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-slate-100 rounded-xl p-8 max-w-4xl mx-auto">
        <h3 className="font-bold text-slate-800 mb-4">Perguntas Frequentes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
                <h4 className="font-semibold text-slate-900 text-sm">Como funciona o teste grátis?</h4>
                <p className="text-slate-500 text-sm mt-1">Você terá acesso total aos recursos do plano escolhido por 3 dias. Se cancelar antes do fim do período, nada será cobrado.</p>
            </div>
            <div>
                <h4 className="font-semibold text-slate-900 text-sm">Posso cancelar a qualquer momento?</h4>
                <p className="text-slate-500 text-sm mt-1">Sim, você pode cancelar sua assinatura a qualquer momento nas configurações da conta. Sem multas.</p>
            </div>
            <div>
                <h4 className="font-semibold text-slate-900 text-sm">Os créditos acumulam?</h4>
                <p className="text-slate-500 text-sm mt-1">Os limites de geração renovam a cada mês e não acumulam para o mês seguinte.</p>
            </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Checkout Seguro</h3>
                <p className="text-sm text-slate-500">Plano {selectedPlan.name} • 3 dias grátis, depois R$ {billingCycle === 'yearly' ? Math.floor(selectedPlan.price * 0.8) : selectedPlan.price}/mês</p>
              </div>
              <button onClick={() => setShowCheckout(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
                {success ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                            <Check className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Período de Teste Iniciado!</h3>
                        <p className="text-slate-500">Bem-vindo ao plano {selectedPlan.name}. Aproveite seus 3 dias grátis.</p>
                    </div>
                ) : (
                    <>
                        {/* Payment Method Selector */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button 
                                onClick={() => setPaymentMethod('card')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border font-medium text-sm transition-all ${
                                    paymentMethod === 'card' 
                                    ? 'border-adzo-500 bg-adzo-50 text-adzo-700' 
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                }`}
                            >
                                <CreditCard className="w-4 h-4" /> Cartão
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('paypal')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border font-medium text-sm transition-all ${
                                    paymentMethod === 'paypal' 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                }`}
                            >
                                <span className="font-bold italic">PayPal</span>
                            </button>
                        </div>

                        {paymentMethod === 'card' && (
                            <div className="space-y-4 animate-in slide-in-from-left-2 duration-300">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome no Cartão</label>
                                    <input type="text" placeholder="Como aparece no cartão" className="w-full rounded-lg border-slate-200 py-2.5 px-3 focus:ring-adzo-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Número do Cartão</label>
                                    <div className="relative">
                                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full rounded-lg border-slate-200 py-2.5 px-3 pl-10 focus:ring-adzo-500" />
                                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Validade</label>
                                        <input type="text" placeholder="MM/AA" className="w-full rounded-lg border-slate-200 py-2.5 px-3 focus:ring-adzo-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVV</label>
                                        <input type="text" placeholder="123" className="w-full rounded-lg border-slate-200 py-2.5 px-3 focus:ring-adzo-500" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'paypal' && (
                             <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 text-center animate-in slide-in-from-right-2 duration-300">
                                 <p className="text-blue-800 font-medium mb-2">Você será redirecionado para o PayPal</p>
                                 <p className="text-sm text-blue-600/80">Conclua o cadastro com segurança. A cobrança só ocorrerá após 3 dias.</p>
                             </div>
                        )}
                        
                        <div className="mt-8 flex items-center justify-between text-sm text-slate-500 mb-6">
                            <span>Hoje você paga:</span>
                            <span className="text-xl font-bold text-slate-900">R$ 0,00</span>
                        </div>

                        <button 
                            onClick={handlePayment}
                            disabled={processing}
                            className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
                                paymentMethod === 'paypal' ? 'bg-[#0070BA] hover:bg-[#005ea6]' : 'bg-adzo-600 hover:bg-adzo-700'
                            }`}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Processando...
                                </>
                            ) : (
                                <>
                                    {paymentMethod === 'paypal' ? 'Iniciar Teste com PayPal' : 'Iniciar Teste Grátis'}
                                </>
                            )}
                        </button>
                        
                        <div className="mt-4 flex justify-center items-center gap-2 text-[10px] text-slate-400">
                             <ShieldCheck className="w-3 h-3" /> Verificação segura para iniciar o teste
                        </div>
                    </>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};