import React from 'react';
import SummaryCard from '../components/dashboard/SummaryCard';
import SprintCard from '../components/dashboard/SprintCard';
import ActiveProjectsCard from '../components/dashboard/ActiveProjectsCard';
import CrmCard from '../components/dashboard/CrmCard';
import TodayTasksCard from '../components/dashboard/TodayTasksCard';
import FinancialSummaryCard from '../components/dashboard/FinancialSummaryCard';
import { summaryCards, activeSprint, activeProjects, crmInteractions, todayTasks, financialSummary } from '../data/mockData';

const Dashboard: React.FC = () => {
    return (
        <main className="flex-1 p-4 sm:p-6 bg-neutral-100/50">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                {summaryCards.map((card, index) => <SummaryCard key={index} data={card} />)}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <SprintCard sprint={activeSprint} />
                    <ActiveProjectsCard projects={activeProjects} />
                </div>
                <div className="space-y-6">
                    <CrmCard interactions={crmInteractions} />
                    <TodayTasksCard tasks={todayTasks} />
                    <FinancialSummaryCard summary={financialSummary} />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;