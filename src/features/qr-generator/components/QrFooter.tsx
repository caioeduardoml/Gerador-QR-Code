import React from 'react';
import { GithubIcon } from '~components/Icons';

export const QrFooter: React.FC = () => {
  return (
    <footer className="w-full mt-auto pt-12 pb-8 px-4">
      <div className="max-w-6xl mx-auto pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-400">
        <p>
          Desenvolvido por{' '}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            Caio Eduardo
          </span>
        </p>

        <a
          href="https://github.com/caioeduardoml/Gerador-QR-Code"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-md px-1 py-0.5"
        >
          <GithubIcon className="w-4 h-4" />
          <span>Codigo-fonte no GitHub</span>
        </a>
      </div>
    </footer>
  );
};

export default QrFooter;
