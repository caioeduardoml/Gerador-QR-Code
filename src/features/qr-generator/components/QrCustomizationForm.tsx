import React, { useState, useCallback } from 'react';
import type {
  QrConfiguration,
  QrContentType,
  QrErrorCorrectionLevel,
  WifiEncryption,
} from '~types/qrcode';
import { QR_COLOR_PRESETS } from '~features/qr-generator/helpers/qrPresets';
import {
  EyeIcon,
  EyeOffIcon,
  FileTextIcon,
  ImageIcon,
  LinkIcon,
  MailIcon,
  MessageIcon,
  SwapIcon,
  TrashIcon,
  WifiIcon,
} from '~components/Icons';

interface QrCustomizationFormProps {
  config: QrConfiguration;
  onSelectContentType: (type: QrContentType) => void;
  onChangeUrlOrText: (value: string) => void;
  onUpdateWifi: (partial: Partial<QrConfiguration['wifi']>) => void;
  onUpdateWhatsapp: (partial: Partial<QrConfiguration['whatsapp']>) => void;
  onUpdateEmail: (partial: Partial<QrConfiguration['email']>) => void;
  onSelectColors: (fgColor: string, bgColor: string) => void;
  onSwapColors: () => void;
  onChangeLevel: (level: QrErrorCorrectionLevel) => void;
  onChangeSize: (size: number) => void;
  onUploadLogo: (file: File | undefined) => void;
  onRemoveLogo: () => void;
  onChangeLogoSize: (size: number) => void;
  onChangeLogoRounded: (rounded: boolean) => void;
}

const CONTENT_TABS: Array<{
  type: QrContentType;
  label: string;
  icon: React.FC<{ className?: string }>;
}> = [
  { type: 'url', label: 'Link / URL', icon: LinkIcon },
  { type: 'wifi', label: 'Wi-Fi', icon: WifiIcon },
  { type: 'whatsapp', label: 'WhatsApp', icon: MessageIcon },
  { type: 'email', label: 'E-mail', icon: MailIcon },
  { type: 'text', label: 'Texto', icon: FileTextIcon },
];

const ERROR_LEVELS: Array<{
  value: QrErrorCorrectionLevel;
  label: string;
  detail: string;
}> = [
  { value: 'L', label: 'Baixa (L)', detail: '7%' },
  { value: 'M', label: 'Media (M)', detail: '15%' },
  { value: 'Q', label: 'Quartil (Q)', detail: '25%' },
  { value: 'H', label: 'Alta (H)', detail: '30% - Ideal p/ Logo' },
];

export const QrCustomizationForm: React.FC<QrCustomizationFormProps> = ({
  config,
  onSelectContentType,
  onChangeUrlOrText,
  onUpdateWifi,
  onUpdateWhatsapp,
  onUpdateEmail,
  onSelectColors,
  onSwapColors,
  onChangeLevel,
  onChangeSize,
  onUploadLogo,
  onRemoveLogo,
  onChangeLogoSize,
  onChangeLogoRounded,
}) => {
  const [showWifiPassword, setShowWifiPassword] = useState<boolean>(false);

  const toggleWifiPasswordVisibility = useCallback(() => {
    setShowWifiPassword((prev) => !prev);
  }, []);

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      onUploadLogo(selectedFile);
      event.target.value = '';
    },
    [onUploadLogo]
  );

  const inputBaseClass =
    'w-full px-3.5 py-2.5 min-h-[44px] rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm transition-colors duration-200 focus:border-blue-600 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/25';

  return (
    <div className="space-y-6">
      {/* Secao 1: Tipo de Conteudo e Dados */}
      <section
        aria-labelledby="section-content-heading"
        className="rounded-2xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 space-y-5"
      >
        <div>
          <h2
            id="section-content-heading"
            className="text-base font-bold text-slate-900 dark:text-slate-100"
          >
            1. Conteudo do QR Code
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Escolha o formato de acao ao escanear o codigo
          </p>
        </div>

        {/* Abas de tipo de conteudo */}
        <div
          role="tablist"
          aria-label="Formatos de conteudo do QR Code"
          className="grid grid-cols-2 sm:grid-cols-5 gap-2"
        >
          {CONTENT_TABS.map(({ type, label, icon: Icon }) => {
            const isSelected = config.contentType === type;
            return (
              <button
                key={type}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectContentType(type)}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20'
                    : 'bg-slate-100/80 hover:bg-slate-200/70 dark:bg-slate-800/70 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Campos dinamicos por tipo */}
        {(config.contentType === 'url' || config.contentType === 'text') && (
          <div>
            <label
              htmlFor="qr-url-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {config.contentType === 'url'
                ? 'Endereco do Site (URL)'
                : 'Texto ou Chave PIX'}
            </label>
            {config.contentType === 'url' ? (
              <input
                id="qr-url-input"
                type="url"
                maxLength={500}
                value={config.urlOrText}
                onChange={(e) => onChangeUrlOrText(e.target.value)}
                placeholder="https://seudominio.com.br"
                className={inputBaseClass}
              />
            ) : (
              <textarea
                id="qr-url-input"
                rows={3}
                maxLength={500}
                value={config.urlOrText}
                onChange={(e) => onChangeUrlOrText(e.target.value)}
                placeholder="Digite qualquer texto, mensagem ou codigo..."
                className={inputBaseClass}
              />
            )}
          </div>
        )}

        {config.contentType === 'wifi' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="wifi-ssid"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Nome da Rede (SSID)
              </label>
              <input
                id="wifi-ssid"
                type="text"
                maxLength={64}
                autoComplete="off"
                value={config.wifi.ssid}
                onChange={(e) => onUpdateWifi({ ssid: e.target.value })}
                placeholder="Ex: Escritorio_5G"
                className={inputBaseClass}
              />
            </div>

            <div>
              <label
                htmlFor="wifi-password"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Senha do Wi-Fi
              </label>
              <div className="relative">
                <input
                  id="wifi-password"
                  type={showWifiPassword ? 'text' : 'password'}
                  maxLength={64}
                  autoComplete="off"
                  value={config.wifi.password}
                  onChange={(e) => onUpdateWifi({ password: e.target.value })}
                  placeholder="Senha da rede"
                  className={`${inputBaseClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={toggleWifiPasswordVisibility}
                  aria-label={
                    showWifiPassword
                      ? 'Ocultar senha do Wi-Fi'
                      : 'Mostrar senha do Wi-Fi'
                  }
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  {showWifiPassword ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="wifi-encryption"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Seguranca
              </label>
              <select
                id="wifi-encryption"
                value={config.wifi.encryption}
                onChange={(e) =>
                  onUpdateWifi({
                    encryption: e.target.value as WifiEncryption,
                  })
                }
                className={`${inputBaseClass} cursor-pointer`}
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Sem senha (Aberta)</option>
              </select>
            </div>

            <div className="flex items-end pb-1">
              <label
                htmlFor="wifi-hidden"
                className="inline-flex items-center gap-2.5 min-h-[44px] text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none"
              >
                <input
                  id="wifi-hidden"
                  type="checkbox"
                  checked={config.wifi.hidden}
                  onChange={(e) => onUpdateWifi({ hidden: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Rede oculta</span>
              </label>
            </div>
          </div>
        )}

        {config.contentType === 'whatsapp' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="wa-phone"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Numero com DDI + DDD
              </label>
              <input
                id="wa-phone"
                type="tel"
                maxLength={20}
                value={config.whatsapp.phone}
                onChange={(e) => onUpdateWhatsapp({ phone: e.target.value })}
                placeholder="5511999999999"
                className={inputBaseClass}
              />
            </div>

            <div>
              <label
                htmlFor="wa-message"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Mensagem automatica (opcional)
              </label>
              <input
                id="wa-message"
                type="text"
                maxLength={300}
                value={config.whatsapp.message}
                onChange={(e) => onUpdateWhatsapp({ message: e.target.value })}
                placeholder="Ola! Vim pelo QR Code."
                className={inputBaseClass}
              />
            </div>
          </div>
        )}

        {config.contentType === 'email' && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="mail-to"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  E-mail de destino
                </label>
                <input
                  id="mail-to"
                  type="email"
                  maxLength={120}
                  value={config.email.email}
                  onChange={(e) => onUpdateEmail({ email: e.target.value })}
                  placeholder="contato@empresa.com"
                  className={inputBaseClass}
                />
              </div>

              <div>
                <label
                  htmlFor="mail-subject"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Assunto
                </label>
                <input
                  id="mail-subject"
                  type="text"
                  maxLength={120}
                  value={config.email.subject}
                  onChange={(e) => onUpdateEmail({ subject: e.target.value })}
                  placeholder="Orcamento / Contato"
                  className={inputBaseClass}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="mail-body"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Mensagem
              </label>
              <textarea
                id="mail-body"
                rows={2}
                maxLength={350}
                value={config.email.body}
                onChange={(e) => onUpdateEmail({ body: e.target.value })}
                placeholder="Escreva o corpo do e-mail..."
                className={inputBaseClass}
              />
            </div>
          </div>
        )}
      </section>

      {/* Secao 2: Cores e Padroes Visuais */}
      <section
        aria-labelledby="section-colors-heading"
        className="rounded-2xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 space-y-5"
      >
        <div>
          <h2
            id="section-colors-heading"
            className="text-base font-bold text-slate-900 dark:text-slate-100"
          >
            2. Paleta de Cores e Nitidez
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Selecione um tema calibrado ou personalize as cores do codigo
          </p>
        </div>

        {/* Presets de cores */}
        <div>
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Paletas Recomendadas (Alto Contraste)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {QR_COLOR_PRESETS.map((preset) => {
              const isSelected =
                config.fgColor.toLowerCase() === preset.fgColor.toLowerCase() &&
                config.bgColor.toLowerCase() === preset.bgColor.toLowerCase();
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectColors(preset.fgColor, preset.bgColor)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl border text-left flex items-center gap-2.5 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-400'
                      : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center -space-x-1.5 shrink-0">
                    <span
                      style={{ backgroundColor: preset.fgColor }}
                      className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs"
                    />
                    <span
                      style={{ backgroundColor: preset.bgColor }}
                      className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs"
                    />
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seletores manuais de cor + botao inverter */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div>
            <label
              htmlFor="fg-color-picker"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Cor do Codigo (Pontos)
            </label>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700">
              <input
                id="fg-color-picker"
                type="color"
                value={config.fgColor}
                onChange={(e) => onSelectColors(e.target.value, config.bgColor)}
                className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer shrink-0"
              />
              <span className="font-mono text-xs font-semibold uppercase text-slate-800 dark:text-slate-200">
                {config.fgColor}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onSwapColors}
            title="Inverter cores do codigo e fundo"
            aria-label="Inverter cores do codigo e fundo"
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <SwapIcon className="w-4 h-4" />
            <span className="sm:hidden">Inverter cores</span>
          </button>

          <div>
            <label
              htmlFor="bg-color-picker"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Cor de Fundo
            </label>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700">
              <input
                id="bg-color-picker"
                type="color"
                value={config.bgColor}
                onChange={(e) => onSelectColors(config.fgColor, e.target.value)}
                className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer shrink-0"
              />
              <span className="font-mono text-xs font-semibold uppercase text-slate-800 dark:text-slate-200">
                {config.bgColor}
              </span>
            </div>
          </div>
        </div>

        {/* Nivel de correcao e Tamanho */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label
              htmlFor="qr-error-level"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Nivel de Correcao de Erro
            </label>
            <select
              id="qr-error-level"
              value={config.level}
              onChange={(e) =>
                onChangeLevel(e.target.value as QrErrorCorrectionLevel)
              }
              className={`${inputBaseClass} cursor-pointer`}
            >
              {ERROR_LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label} - Recupera ate {lvl.detail}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="qr-size-slider"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Tamanho da Visualizacao
              </label>
              <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                {config.size}px
              </span>
            </div>
            <input
              id="qr-size-slider"
              type="range"
              min={160}
              max={280}
              step={10}
              value={config.size}
              onChange={(e) => onChangeSize(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
            />
          </div>
        </div>
      </section>

      {/* Secao 3: Logo Central */}
      <section
        aria-labelledby="section-logo-heading"
        className="rounded-2xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2
              id="section-logo-heading"
              className="text-base font-bold text-slate-900 dark:text-slate-100"
            >
              3. Logo ou Imagem Central (Opcional)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Personalize o centro do QR Code com a marca do seu projeto
            </p>
          </div>

          {config.logoDataUrl && (
            <button
              type="button"
              onClick={onRemoveLogo}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Remover logo</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <label
            htmlFor="qr-logo-upload"
            className="flex-1 flex items-center justify-center gap-3 px-4 py-4 min-h-[56px] rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-blue-50/40 dark:hover:bg-slate-800/80 transition-colors duration-200 cursor-pointer focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-600"
          >
            <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                {config.logoDataUrl
                  ? 'Trocar imagem central'
                  : 'Clique para selecionar uma imagem (PNG, JPG ou WebP)'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Formatos raster verificados - Tamanho maximo: 4 MB
              </span>
            </div>
            <input
              id="qr-logo-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileInputChange}
              className="sr-only"
            />
          </label>
        </div>

        {config.logoDataUrl && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/70 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="logo-size-slider"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Dimensao da Logo
                </label>
                <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                  {config.logoSize}px
                </span>
              </div>
              <input
                id="logo-size-slider"
                type="range"
                min={32}
                max={64}
                step={4}
                value={config.logoSize}
                onChange={(e) => onChangeLogoSize(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Formato da Moldura
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChangeLogoRounded(true)}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors duration-200 cursor-pointer ${
                    config.logoRounded
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Circular
                </button>
                <button
                  type="button"
                  onClick={() => onChangeLogoRounded(false)}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors duration-200 cursor-pointer ${
                    !config.logoRounded
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Quadrado
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default QrCustomizationForm;
