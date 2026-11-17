import React, { Suspense } from 'react';

interface SuspenseLoaderProps {
  children: React.ReactNode;
  fallbackHeight?: string;
}

export const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({
  children,
  fallbackHeight = 'min-h-[540px]',
}) => {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          aria-label="Carregando interface do gerador"
          className={`w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 ${fallbackHeight}`}
        >
          <div className="lg:col-span-7 rounded-2xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse p-6 border border-slate-200 dark:border-slate-700/60" />
          <div className="lg:col-span-5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse p-6 border border-slate-200 dark:border-slate-700/60" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default SuspenseLoader;
