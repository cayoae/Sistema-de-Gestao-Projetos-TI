import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon } from '../icons/Icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error: error });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-neutral-50">
            <AlertTriangleIcon className="w-16 h-16 text-error mb-4" />
            <h1 className="text-2xl font-bold text-neutral-800">Oops! Algo deu errado.</h1>
            <p className="text-neutral-500 mt-2">
                Ocorreu um erro ao tentar renderizar esta página. Por favor, tente recarregar.
            </p>
            {this.state.error && (
                <pre className="mt-4 p-2 bg-neutral-100 text-error text-xs rounded-md max-w-lg overflow-auto">
                    {this.state.error.toString()}
                </pre>
            )}
            <button
                onClick={() => window.location.reload()}
                className="mt-6 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
                Recarregar a Página
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
