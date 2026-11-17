import React from 'react';
import type { ToastMessage } from '~types/qrcode';
import { CheckCircleIcon, AlertCircleIcon, InfoIcon, CloseIcon } from '~components/Icons';

interface ToastNotificationProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toast,
  onDismiss,
}) => {
  if (!toast) {
    return null;
  }

  const variantStyles: Record<ToastMessage['variant'], string> = {
    success:
      'bg-emerald-950/95 text-emerald-50 border-emerald-500/40 shadow-emerald-950/30',
    error:
      'bg-rose-950/95 text-rose-50 border-rose-500/40 shadow-rose-950/30',
    info: 'bg-slate-900/95 text-slate-50 border-blue-500/40 shadow-slate-950/30',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100%-2.5rem)] sm:w-auto transition-all duration-200"
    >
      <div
        className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-md shadow-xl ${variantStyles[toast.variant]}`}
      >
        <span className="mt-0.5 shrink-0">
          {toast.variant === 'success' && (
            <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
          )}
          {toast.variant === 'error' && (
            <AlertCircleIcon className="w-5 h-5 text-rose-400" />
          )}
          {toast.variant === 'info' && (
            <InfoIcon className="w-5 h-5 text-blue-400" />
          )}
        </span>

        <div className="flex-1 text-sm">
          <p className="font-semibold leading-snug">{toast.title}</p>
          {toast.description && (
            <p className="mt-0.5 text-xs opacity-85 leading-relaxed">
              {toast.description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar notificacao"
          className="p-1 rounded-lg opacity-75 hover:opacity-100 hover:bg-white/10 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
