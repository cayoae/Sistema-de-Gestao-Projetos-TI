import React, { useState } from 'react';
import { FinancialService } from '../../lib/services/financialService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'csv' | 'pdf' | 'excel';
type ExportType = 'payments' | 'revenue' | 'costs' | 'summary';

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [exportType, setExportType] = useState<ExportType>('summary');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const exportOptions = [
    { value: 'summary', label: 'Resumo Financeiro', description: 'Métricas gerais e KPIs' },
    { value: 'payments', label: 'Pagamentos', description: 'Recebimentos e pendências' },
    { value: 'revenue', label: 'Receitas', description: 'Faturamento por período' },
    { value: 'costs', label: 'Custos', description: 'Despesas e ferramentas' }
  ];

  const formatOptions = [
    { value: 'csv', label: 'CSV', description: 'Para Excel e planilhas' },
    { value: 'pdf', label: 'PDF', description: 'Relatório formatado' },
    { value: 'excel', label: 'Excel', description: 'Planilha nativa' }
  ];

  const handleExport = async () => {
    setLoading(true);

    try {
      // Get financial data
      const { data: financialData, error } = await FinancialService.getFinancialMetrics();

      if (error || !financialData) {
        console.error('Error fetching data for export:', error);
        return;
      }

      let exportData: any = null;
      let filename = '';

      // Prepare data based on type
      switch (exportType) {
        case 'summary':
          exportData = {
            resumo_executivo: {
              faturado: financialData.billed,
              recebido: financialData.received,
              pendente: financialData.pending,
              custos: financialData.costs,
              roi: financialData.roi
            },
            metas: financialData.financialGoals,
            periodo: `${dateRange.start} a ${dateRange.end}`
          };
          filename = `resumo_financeiro_${new Date().toISOString().split('T')[0]}`;
          break;

        case 'payments':
          exportData = {
            proximos_pagamentos: financialData.upcomingPayments,
            recebimentos_realizados: financialData.completedPayments,
            periodo: `${dateRange.start} a ${dateRange.end}`
          };
          filename = `pagamentos_${new Date().toISOString().split('T')[0]}`;
          break;

        case 'revenue':
          const { data: revenueData } = await FinancialService.getRevenueByMonth();
          exportData = {
            receitas_por_mes: revenueData || [],
            total_faturado: financialData.billed,
            total_recebido: financialData.received,
            periodo: `${dateRange.start} a ${dateRange.end}`
          };
          filename = `receitas_${new Date().toISOString().split('T')[0]}`;
          break;

        case 'costs':
          exportData = {
            custos_mensais: financialData.monthlyCosts,
            total_custos: financialData.costs,
            rentabilidade: financialData.profitability,
            periodo: `${dateRange.start} a ${dateRange.end}`
          };
          filename = `custos_${new Date().toISOString().split('T')[0]}`;
          break;
      }

      // Export based on format
      if (exportFormat === 'csv') {
        exportToCSV(exportData, filename);
      } else if (exportFormat === 'pdf') {
        exportToPDF(exportData, filename);
      } else if (exportFormat === 'excel') {
        exportToExcel(exportData, filename);
      }

      onClose();

    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any, filename: string) => {
    // Convert data to CSV format
    let csvContent = '';

    if (exportType === 'summary') {
      csvContent = 'Métrica,Valor\n';
      csvContent += `Faturado,${data.resumo_executivo.faturado}\n`;
      csvContent += `Recebido,${data.resumo_executivo.recebido}\n`;
      csvContent += `Pendente,${data.resumo_executivo.pendente}\n`;
      csvContent += `Custos,${data.resumo_executivo.custos}\n`;
      csvContent += `ROI,${data.resumo_executivo.roi}%\n`;
    } else if (exportType === 'payments') {
      csvContent = 'Tipo,Cliente,Projeto,Valor,Data,Status\n';
      data.proximos_pagamentos.forEach((p: any) => {
        csvContent += `Próximo,${p.clientName},${p.projectName},${p.amount},${p.date},${p.status}\n`;
      });
      data.recebimentos_realizados.forEach((p: any) => {
        csvContent += `Realizado,${p.clientName},${p.projectName},${p.amount},${p.date},${p.status}\n`;
      });
    }

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (data: any, filename: string) => {
    // For now, create a simple HTML report and let browser print/save as PDF
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f5f5f5; }
        </style>
      </head>
      <body>
        <h1>Relatório Financeiro</h1>
        <p>Período: ${data.periodo}</p>
        <h2>Dados</h2>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        <script>window.print();</script>
      </body>
      </html>
    `;

    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
  };

  const exportToExcel = (data: any, filename: string) => {
    // For now, use CSV format but with .xlsx extension
    // In a real app, you'd use a library like xlsx or exceljs
    exportToCSV(data, filename.replace('.csv', '.xlsx'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-800">Exportar Relatório</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Tipo de Relatório
            </label>
            <div className="space-y-2">
              {exportOptions.map((option) => (
                <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value={option.value}
                    checked={exportType === option.value}
                    onChange={(e) => setExportType(e.target.value as ExportType)}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-medium text-neutral-800">{option.label}</p>
                    <p className="text-sm text-neutral-500">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Formato
            </label>
            <div className="grid grid-cols-3 gap-2">
              {formatOptions.map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    value={option.value}
                    checked={exportFormat === option.value}
                    onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                    className="sr-only"
                  />
                  <div className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    exportFormat === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-neutral-500 mt-1">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Período
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">De</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Até</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleExport}
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exportando...
                </div>
              ) : (
                'Exportar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;