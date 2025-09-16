import React, { useState, useEffect } from 'react';
import SummaryCard from '../components/dashboard/SummaryCard';
import SprintCard from '../components/dashboard/SprintCard';
import ActiveProjectsCard from '../components/dashboard/ActiveProjectsCard';
import CrmCard from '../components/dashboard/CrmCard';
import TodayTasksCard from '../components/dashboard/TodayTasksCard';
import FinancialSummaryCard from '../components/dashboard/FinancialSummaryCard';
import { DashboardService, DashboardMetrics } from '../lib/services/dashboardService';
import { SummaryCardData, FinancialSummary, Project, CrmInteraction } from '../types';

const Dashboard: React.FC = () => {
    const [realSummaryCards, setRealSummaryCards] = useState<SummaryCardData[]>([]);
    const [realActiveProjects, setRealActiveProjects] = useState<Project[]>([]);
    const [realFinancialSummary, setRealFinancialSummary] = useState<FinancialSummary>({ totalRevenue: 0, totalExpenses: 0, profit: 0, profitMargin: 0 });
    const [realCrmInteractions, setRealCrmInteractions] = useState<CrmInteraction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Get dashboard metrics
            const { data: metrics, error: metricsError } = await DashboardService.getDashboardMetrics();

            if (metricsError) {
                setError(metricsError);
                console.error('Failed to load dashboard metrics:', metricsError);
                return;
            }

            if (metrics) {
                // Update summary cards with real data
                const realCards = DashboardService.generateSummaryCards(metrics);
                setRealSummaryCards(realCards);

                // Update financial summary with real data
                const realFinancial = DashboardService.generateFinancialSummary(metrics);
                setRealFinancialSummary(realFinancial);
            }

            // Get active projects
            const { data: projects, error: projectsError } = await DashboardService.getActiveProjects();

            if (projectsError) {
                console.error('Failed to load active projects:', projectsError);
            } else if (projects) {
                setRealActiveProjects(projects);
            }

            // Get recent interactions
            const { data: interactions, error: interactionsError } = await DashboardService.getRecentInteractions();

            if (interactionsError) {
                console.error('Failed to load interactions:', interactionsError);
            } else if (interactions) {
                setRealCrmInteractions(interactions);
            }

            setLastUpdate(new Date());

        } catch (err) {
            console.error('Dashboard data loading error:', err);
            setError('Erro inesperado ao carregar dados do dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        loadDashboardData();
    };

    return (
        <main className="flex-1 p-4 sm:p-6 bg-neutral-100/50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">Dashboard</h1>
                <div className="flex gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loading ? 'Atualizando...' : 'Atualizar'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-error/20 border border-error/50 rounded-lg text-error">
                    <strong>Erro ao carregar dashboard:</strong> {error}
                </div>
            )}

            {!loading && (
                <div className="mb-4 text-sm text-neutral-600">
                    Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="animate-pulse">
                                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    realSummaryCards.map((card, index) => <SummaryCard key={index} data={card} />)
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="animate-pulse">
                                <div className="h-6 bg-neutral-200 rounded w-1/3 mb-4"></div>
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="h-16 bg-neutral-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ActiveProjectsCard projects={realActiveProjects} />
                    )}
                </div>
                <div className="space-y-6">
                    {loading ? (
                        <>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="animate-pulse">
                                    <div className="h-6 bg-neutral-200 rounded w-1/2 mb-4"></div>
                                    <div className="space-y-3">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="h-12 bg-neutral-200 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="animate-pulse">
                                    <div className="h-6 bg-neutral-200 rounded w-1/3 mb-4"></div>
                                    <div className="h-20 bg-neutral-200 rounded"></div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <CrmCard interactions={realCrmInteractions} />
                            <FinancialSummaryCard summary={realFinancialSummary} />
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Dashboard;