import React from 'react';
import avatar from '@/assets/eu.jpeg';
import { GithubIcon, MoonIcon, QrCodeIcon, SunIcon } from '~components/Icons';

interface QrHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const QrHeader: React.FC<QrHeaderProps> = ({
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-4 z-30 w-full px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/25 shrink-0">
            <QrCodeIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 block leading-none">
              QR Code Studio
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">
              Gerador instantaneo em alta definicao
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="https://github.com/caioeduardoml"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visitar perfil do GitHub de Caio Eduardo"
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/90 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <img
              src={avatar}
              alt="Foto de perfil de Caio Eduardo"
              className="w-8 h-8 rounded-full object-cover border border-blue-500/40 shrink-0"
            />
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold">
              <GithubIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>@caioeduardoml</span>
            </span>
          </a>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              isDark ? 'Ativar modo claro' : 'Ativar modo escuro'
            }
            title={isDark ? 'Modo claro' : 'Modo escuro'}
            className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/90 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {isDark ? (
              <SunIcon className="w-5 h-5 text-amber-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default QrHeader;
