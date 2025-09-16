
import React from 'react';
import { FinancialSummary } from '../../types';
import { FinanceIcon } from '../icons/Icons';

interface FinancialSummaryCardProps {
  summary: FinancialSummary;
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ summary }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
       <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-700 flex items-center">
            <FinanceIcon className="w-5 h-5 mr-2 text-primary" />
            Resumo Financeiro
        </h3>
        <button className="text-sm font-medium text-primary hover:underline">Ver Detalhes</button>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
            <p className="text-xs text-neutral-500">Este Mês</p>
            <p className="text-2xl font-bold text-secondary">R$ {summary.thisMonthRevenue.toLocaleString('pt-BR')}</p>
        </div>
         <div>
            <p className="text-xs text-neutral-500">Próximos Pagamentos</p>
            <p className="text-2xl font-bold text-neutral-700">R$ {summary.nextPayments.toLocaleString('pt-BR')}</p>
        </div>
         <div>
            <p className="text-xs text-neutral-500">Custos Ferramentas</p>
            <p className="text-2xl font-bold text-error">R$ {summary.toolCosts.toLocaleString('pt-BR')}<span className="text-sm font-normal text-neutral-500">/mês</span></p>
        </div>
         <div>
            <p className="text-xs text-neutral-500">ROI Médio</p>
            <p className="text-2xl font-bold text-primary">{summary.averageROI}%</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummaryCard;
