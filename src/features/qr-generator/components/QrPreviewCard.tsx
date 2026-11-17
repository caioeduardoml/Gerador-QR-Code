import React, { useMemo } from 'react';
import { QRCode } from 'react-qr-code';
import type { ContrastEvaluation, QrConfiguration } from '~types/qrcode';
import { maskSensitivePayload } from '~features/qr-generator/helpers/qrPresets';
import {
  AlertCircleIcon,
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  InfoIcon,
  RefreshIcon,
} from '~components/Icons';

interface QrPreviewCardProps {
  config: QrConfiguration;
  payload: string;
  contrast: ContrastEvaluation;
  isExporting: boolean;
  qrContainerRef: React.RefObject<HTMLDivElement | null>;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
  onCopyImage: () => void;
  onReset: () => void;
}

export const QrPreviewCard: React.FC<QrPreviewCardProps> = ({
  config,
  payload,
  contrast,
  isExporting,
  qrContainerRef,
  onDownloadPng,
  onDownloadSvg,
  onCopyImage,
  onReset,
}) => {
  const statusStyles: Record<ContrastEvaluation['status'], string> = {
    excellent:
      'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800/70',
    good: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800/70',
    poor: 'bg-amber-50 text-amber-950 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700/80',
  };

  const maskedPayloadDisplay = useMemo(
    () => maskSensitivePayload(payload, config.contentType),
    [payload, config.contentType]
  );

  return (
    <aside
      aria-label="Pre-visualizacao e exportacao do QR Code"
      className="lg:sticky lg:top-24 rounded-2xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-lg shadow-slate-900/5 p-6 flex flex-col gap-5"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Pre-visualizacao em Tempo Real
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Pronto para escaneamento e impressao
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          title="Restaurar padrao"
          aria-label="Restaurar configuracoes iniciais"
          className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <RefreshIcon className="w-3.5 h-3.5" />
          <span>Resetar</span>
        </button>
      </div>

      {/* Container de captura do QR Code */}
      <div className="flex items-center justify-center py-6 px-4 rounded-2xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80">
        <div
          ref={qrContainerRef}
          style={{
            backgroundColor: config.bgColor,
            padding: config.includeMargin ? '20px' : '8px',
          }}
          className="relative inline-flex items-center justify-center rounded-2xl shadow-md transition-colors duration-200"
        >
          <QRCode
            value={payload}
            fgColor={config.fgColor}
            bgColor={config.bgColor}
            size={config.size}
            level={config.level}
          />

          {config.logoDataUrl && (
            <div
              style={{
                width: `${config.logoSize}px`,
                height: `${config.logoSize}px`,
                backgroundColor: config.bgColor,
              }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 shadow-sm flex items-center justify-center overflow-hidden ${
                config.logoRounded ? 'rounded-full' : 'rounded-xl'
              }`}
            >
              <img
                src={config.logoDataUrl}
                alt="Logo central do QR Code"
                className={`w-full h-full object-contain ${
                  config.logoRounded ? 'rounded-full' : 'rounded-lg'
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Indicador de contraste de leitura */}
      <div
        className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs ${statusStyles[contrast.status]}`}
      >
        <span className="mt-0.5 shrink-0">
          {contrast.status === 'excellent' && (
            <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          )}
          {contrast.status === 'good' && (
            <InfoIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          )}
          {contrast.status === 'poor' && (
            <AlertCircleIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          )}
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 font-semibold">
            <span>Indice de Contraste</span>
            <span className="font-mono">{contrast.ratio}:1</span>
          </div>
          <p className="mt-0.5 opacity-90 leading-relaxed">{contrast.message}</p>
        </div>
      </div>

      {/* Resumo do destino codificado */}
      <div className="rounded-xl bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 px-3.5 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
          Conteudo Codificado
        </span>
        <p
          title={maskedPayloadDisplay}
          className="text-xs font-mono text-slate-800 dark:text-slate-200 truncate mt-0.5"
        >
          {maskedPayloadDisplay}
        </p>
      </div>

      {/* Acoes de exportacao */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          onClick={onDownloadPng}
          disabled={isExporting}
          className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-semibold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>{isExporting ? 'Processando...' : 'Baixar PNG (Alta Definicao)'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onDownloadSvg}
            disabled={isExporting}
            className="min-h-[44px] px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/85 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-semibold text-xs border border-slate-200/90 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Baixar SVG</span>
          </button>

          <button
            type="button"
            onClick={onCopyImage}
            disabled={isExporting}
            className="min-h-[44px] px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/85 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-semibold text-xs border border-slate-200/90 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <CopyIcon className="w-4 h-4" />
            <span>Copiar QR</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default QrPreviewCard;
