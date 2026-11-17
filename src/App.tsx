import React, { useState, useEffect, useCallback } from 'react';
import { SuspenseLoader } from '~components/SuspenseLoader';
import { QrHeader, QrFooter } from '~features/qr-generator';

const LazyQrGeneratorWorkspace = React.lazy(
  () => import('~features/qr-generator/components/QrGeneratorWorkspace')
);

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = window.localStorage.getItem('qr-studio-theme');
    if (saved === 'dark' || saved === 'light') {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      window.localStorage.setItem('qr-studio-theme', 'dark');
    } else {
      root.classList.remove('dark');
      window.localStorage.setItem('qr-studio-theme', 'light');
    }
  }, [isDark]);

  const handleToggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden">
      {/* Elementos decorativos de iluminacao de fundo (Glassmorphism) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/3 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl"
      />

      <QrHeader isDark={isDark} onToggleTheme={handleToggleTheme} />

      <main className="flex-1 w-full px-4 sm:px-6 pt-8 pb-6 z-10">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/90 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/70 mb-3">
            Personalizacao em Tempo Real
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Crie QR Codes Profissionais com Sua Identidade Visual
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Configure links, redes Wi-Fi, WhatsApp ou e-mails, valide o
            contraste de leitura automaticamente e exporte em PNG de alta
            definicao ou SVG vetorial.
          </p>
        </div>

        <SuspenseLoader>
          <LazyQrGeneratorWorkspace />
        </SuspenseLoader>
      </main>

      <QrFooter />
    </div>
  );
};

export default App;
