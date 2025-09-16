import React from 'react';
import { 
    mockFinancialExecutiveSummary,
    mockUpcomingPayments,
    mockCompletedPayments,
    mockMonthlyCosts,
    mockProfitability,
    mockFinancialGoals
} from '../data/mockData';
import { FinancialExecutiveSummary, Payment, CostCategory, ProfitabilityMetrics, FinancialGoal } from '../types';
import { DollarSignIcon, ReceiptIcon, TrendingUpIcon, TargetIcon, UsersIcon, BriefcaseIcon, CreditCardIcon } from '../components/icons/Icons';

// Helper to format currency
const formatCurrency = (value: number) => `R$ ${value.toLocaleString('pt-BR')}`;

// --- SUB-COMPONENTS for FinancialScreen ---

const ExecutiveSummary: React.FC<{ summary: FinancialExecutiveSummary }> = ({ summary }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-sm text-neutral-500">Faturado (Mês)</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(summary.billed)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-sm text-neutral-500">Recebido</p>
            <p className="text-2xl font-bold text-secondary">{formatCurrency(summary.received)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-sm text-neutral-500">Pendente</p>
            <p className="text-2xl font-bold text-attention">{formatCurrency(summary.pending)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-sm text-neutral-500">Custos</p>
            <p className="text-2xl font-bold text-error">{formatCurrency(summary.costs)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center col-span-2 md:col-span-1">
            <p className="text-sm text-neutral-500">ROI Médio</p>
            <p className="text-2xl font-bold text-primary">{summary.roi}%</p>
        </div>
    </div>
);

const PaymentListItem: React.FC<{ payment: Payment, type: 'upcoming' | 'completed' }> = ({ payment, type }) => {
    const statusClasses: { [key in Payment['status']]: string } = {
        sent: 'bg-blue-100 text-blue-700',
        pending: 'bg-yellow-100 text-yellow-700',
        scheduled: 'bg-purple-100 text-purple-700',
        received: 'bg-green-100 text-green-700'
    };
    const statusTexts: { [key in Payment['status']]: string } = {
        sent: 'Enviada',
        pending: 'Aguardando',
        scheduled: 'Agendada',
        received: 'Recebido'
    };
    const paymentMethodIcons = {
        'PIX': <span className="font-bold text-xs">PIX</span>,
        'Transferência': <TrendingUpIcon className="w-4 h-4 text-neutral-500" />,
        'Cartão': <CreditCardIcon className="w-4 h-4 text-neutral-500" />,
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 px-2 rounded-lg hover:bg-neutral-50">
            <div className="flex-1 mb-2 md:mb-0">
                <div className="flex items-center">
                    <span className="font-bold text-neutral-700 mr-2">{payment.date}</span>
                    <p className="font-semibold text-neutral-800">{payment.clientName}</p>
                </div>
                <div className="flex items-center mt-1">
                     <div className={`w-2 h-2 rounded-full mr-2 ${ {green: 'bg-secondary', yellow: 'bg-attention', red: 'bg-error'}[payment.projectStatusColor]}`}></div>
                    <p className="text-sm text-neutral-500">{payment.projectName} - {payment.description}</p>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-neutral-600 mr-4">
                   {payment.method && paymentMethodIcons[payment.method]}
                   <span className="ml-1.5">{payment.method}</span>
                </div>
                 {type === 'upcoming' && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[payment.status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusTexts[payment.status] || payment.status}
                    </span>
                 )}
                 <p className="font-bold text-lg text-neutral-800 w-32 text-right">{formatCurrency(payment.amount)}</p>
                 {type === 'upcoming' ? (
                     <button className="ml-4 bg-secondary/20 text-secondary-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-secondary/30">Receber</button>
                 ) : (
                    <button className="ml-4 text-neutral-500 hover:text-primary"><ReceiptIcon className="w-5 h-5"/></button>
                 )}
            </div>
        </div>
    );
};

const CostsCard: React.FC<{ costs: CostCategory[] }> = ({ costs }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-700 mb-4">Custos Mensais - Ferramentas</h3>
        <div className="space-y-4">
            {costs.map(category => (
                <div key={category.category}>
                    <div className="flex justify-between items-baseline">
                        <h4 className="font-semibold text-neutral-600 text-sm tracking-wider">{category.category}</h4>
                        <p className="font-bold text-neutral-700">{formatCurrency(category.total)}<span className="text-sm font-normal text-neutral-500">/mês</span></p>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-neutral-500 pl-4 border-l-2 border-neutral-200">
                        {category.items.map(item => (
                            <div key={item.name} className="flex justify-between">
                                <span>{item.name}</span>
                                <span>{formatCurrency(item.amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ProfitabilityCard: React.FC<{ metrics: ProfitabilityMetrics }> = ({ metrics }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-700 mb-4">Análise de Rentabilidade</h3>
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-neutral-600 text-sm flex items-center"><BriefcaseIcon className="w-4 h-4 mr-2"/> PROJETO MAIS RENTÁVEL</h4>
                <div className="text-sm mt-1 pl-6">
                    <p className="font-bold text-secondary">{metrics.mostProfitableProject.name}</p>
                    <p>ROI: <span className="font-medium">{metrics.mostProfitableProject.roi}%</span> | Valor/hora: <span className="font-medium">{formatCurrency(metrics.mostProfitableProject.valuePerHour)}</span></p>
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-neutral-600 text-sm flex items-center"><UsersIcon className="w-4 h-4 mr-2"/> CLIENTE MAIS VALIOSO</h4>
                <div className="text-sm mt-1 pl-6">
                    <p className="font-bold text-primary">{metrics.mostValuableClient.name}</p>
                    <p>Total investido: <span className="font-medium">{formatCurrency(metrics.mostValuableClient.totalInvested)}</span> | LTV: <span className="font-medium">{formatCurrency(metrics.mostValuableClient.ltv)}</span></p>
                </div>
            </div>
        </div>
    </div>
);


const GoalCard: React.FC<{ goal: FinancialGoal }> = ({ goal }) => {
    const progress = Math.min((goal.current / goal.target) * 100, 100);
    return(
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">{goal.label}</h3>
            <p className="text-3xl font-bold text-primary">{formatCurrency(goal.target)}</p>
            <div className="w-full bg-neutral-200 rounded-full h-2.5 my-2">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-sm text-neutral-500 flex justify-between">
                <span>Atingido: <span className="font-semibold text-neutral-700">{formatCurrency(goal.current)} ({progress.toFixed(0)}%)</span></span>
                <span>Restam: {goal.deadline}</span>
            </div>
        </div>
    );
}

// --- MAIN FinancialScreen Component ---

const FinancialScreen: React.FC = () => {
    return (
        <main className="flex-1 p-4 sm:p-6 bg-neutral-100/50">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">Controle Financeiro</h1>
                <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm self-start sm:self-center">
                    + Novo Recebimento
                </button>
            </div>
            
            <ExecutiveSummary summary={mockFinancialExecutiveSummary} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-neutral-700 mb-2">Próximos Pagamentos</h3>
                        <div className="divide-y divide-neutral-100">
                           {mockUpcomingPayments.map(p => <PaymentListItem key={p.id} payment={p} type="upcoming" />)}
                        </div>
                    </div>
                     <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-neutral-700 mb-2">Recebimentos Realizados</h3>
                        <div className="divide-y divide-neutral-100">
                           {mockCompletedPayments.map(p => <PaymentListItem key={p.id} payment={p} type="completed" />)}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <CostsCard costs={mockMonthlyCosts} />
                    <ProfitabilityCard metrics={mockProfitability} />
                    {mockFinancialGoals.map(g => <GoalCard key={g.label} goal={g} />)}
                </div>
            </div>
        </main>
    );
};

export default FinancialScreen;