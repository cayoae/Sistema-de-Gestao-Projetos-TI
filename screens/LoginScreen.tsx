import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTestMode, setIsTestMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Test mode bypasses validation and uses mock authentication
    if (isTestMode) {
      setTimeout(() => {
        onLoginSuccess();
        setIsLoading(false);
      }, 500);
      return;
    }

    if (!email || !password) {
      setError('Por favor, preencha o email e a senha.');
      setIsLoading(false);
      return;
    }

    try {
      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
      } else if (data.user) {
        // Store session info if remember me is checked
        if (rememberMe) {
          localStorage.setItem('supabase.auth.remember', 'true');
        }
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-800">ProjectsControl</h1>
          <p className="mt-2 text-sm text-neutral-500">Faça login para continuar</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={isTestMode}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-neutral-100 disabled:cursor-not-allowed"
            />
          </div>
          
          <div>
            <label htmlFor="password"className="text-sm font-medium text-neutral-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              disabled={isTestMode}
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-neutral-100 disabled:cursor-not-allowed"
            />
          </div>
          
          {error && <p className="text-sm text-error text-center">{error}</p>}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-800">
                Lembrar-me
              </label>
            </div>
          </div>
          
           <div className="text-center border-t border-neutral-200 pt-4">
            <button
              type="button"
              onClick={() => setIsTestMode(!isTestMode)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                isTestMode 
                ? 'bg-secondary/20 text-secondary-700' 
                : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
              }`}
            >
              Modo de Teste: {isTestMode ? 'ON' : 'OFF'}
            </button>
            {isTestMode && <p className="text-xs text-neutral-500 mt-2">Login sem credenciais está ativado.</p>}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary/50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;