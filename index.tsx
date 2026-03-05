
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { AuthProvider } from './context/AuthContext';
import { initSentry } from './services/sentry';
import App from './App';

// Initialize Sentry before rendering
initSentry();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);

function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        <div className="text-6xl mb-4">😔</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Kažkas nutiko</h1>
        <p className="text-slate-600 mb-6">Atsiprašome, įvyko netikėta klaida. Bandykite atnaujinti puslapį.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors"
        >
          Atnaujinti puslapį
        </button>
      </div>
    </div>
  );
}
