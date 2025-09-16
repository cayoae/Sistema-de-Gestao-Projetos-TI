// FIX: Replaced placeholder content with a full implementation for the App component, including routing and layout management to correctly structure the application.
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import FloatingActionButton from './components/common/FloatingActionButton';
import LoginScreen from './screens/LoginScreen';
import Dashboard from './screens/Dashboard';
import ProjectsScreen from './screens/ProjectsScreen';
import NewProjectScreen from './screens/NewProjectScreen';
import ClientsScreen from './screens/ClientsScreen';
import ClientDetailScreen from './screens/ClientDetailScreen';
import TasksScreen from './screens/TasksScreen';
import FinancialScreen from './screens/FinancialScreen';
import SprintControlScreen from './screens/SprintControlScreen';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <div className="relative flex h-screen bg-neutral-100/50 font-sans overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(true)} onLogout={handleLogout} />
          <div className="flex-1 overflow-y-auto">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectsScreen />} />
                <Route path="/projects/new" element={<NewProjectScreen />} />
                <Route path="/clients" element={<ClientsScreen />} />
                <Route path="/clients/:id" element={<ClientDetailScreen />} />
                <Route path="/tasks" element={<TasksScreen />} />
                <Route path="/financials" element={<FinancialScreen />} />
                <Route path="/sprints" element={<SprintControlScreen />} />
              </Routes>
            </ErrorBoundary>
          </div>
          <FloatingActionButton />
        </div>
      </div>
    </Router>
  );
}

export default App;