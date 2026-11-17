import { useState, useRef, useCallback, useMemo } from 'react';
import type {
  QrConfiguration,
  QrContentType,
  QrErrorCorrectionLevel,
  ToastMessage,
  ToastVariant,
} from '~types/qrcode';
import {
  ALLOWED_LOGO_MIME_TYPES,
  DEFAULT_QR_CONFIG,
  buildQrPayload,
  evaluateQrContrast,
  hasValidRasterMagicBytes,
} from '~features/qr-generator/helpers/qrPresets';
import {
  exportQrToPng,
  exportQrToSvg,
  copyQrImageToClipboard,
} from '~features/qr-generator/helpers/qrExport';

export function useQrGenerator() {
  const [config, setConfig] = useState<QrConfiguration>(DEFAULT_QR_CONFIG);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }

      const nextToast: ToastMessage = {
        id: String(Date.now()),
        variant,
        title,
        description,
      };
      setToast(nextToast);

      toastTimerRef.current = window.setTimeout(() => {
        setToast(null);
      }, 4200);
    },
    []
  );

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast(null);
  }, []);

  const payload = useMemo(() => buildQrPayload(config), [config]);

  const contrast = useMemo(
    () => evaluateQrContrast(config.fgColor, config.bgColor),
    [config.fgColor, config.bgColor]
  );

  const setContentType = useCallback((contentType: QrContentType) => {
    setConfig((prev) => ({ ...prev, contentType }));
  }, []);

  const setUrlOrText = useCallback((urlOrText: string) => {
    setConfig((prev) => ({ ...prev, urlOrText }));
  }, []);

  const updateWifi = useCallback(
    (partial: Partial<QrConfiguration['wifi']>) => {
      setConfig((prev) => ({
        ...prev,
        wifi: { ...prev.wifi, ...partial },
      }));
    },
    []
  );

  const updateWhatsapp = useCallback(
    (partial: Partial<QrConfiguration['whatsapp']>) => {
      setConfig((prev) => ({
        ...prev,
        whatsapp: { ...prev.whatsapp, ...partial },
      }));
    },
    []
  );

  const updateEmail = useCallback(
    (partial: Partial<QrConfiguration['email']>) => {
      setConfig((prev) => ({
        ...prev,
        email: { ...prev.email, ...partial },
      }));
    },
    []
  );

  const setColors = useCallback((fgColor: string, bgColor: string) => {
    setConfig((prev) => ({ ...prev, fgColor, bgColor }));
  }, []);

  const swapColors = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      fgColor: prev.bgColor,
      bgColor: prev.fgColor,
    }));
  }, []);

  const setLevel = useCallback((level: QrErrorCorrectionLevel) => {
    setConfig((prev) => ({ ...prev, level }));
  }, []);

  const setSize = useCallback((size: number) => {
    setConfig((prev) => ({ ...prev, size }));
  }, []);

  const setLogoSize = useCallback((logoSize: number) => {
    setConfig((prev) => ({ ...prev, logoSize }));
  }, []);

  const setLogoRounded = useCallback((logoRounded: boolean) => {
    setConfig((prev) => ({ ...prev, logoRounded }));
  }, []);

  const handleLogoUpload = useCallback(
    async (file: File | undefined) => {
      if (!file) return;

      const isAllowedMime = (
        ALLOWED_LOGO_MIME_TYPES as readonly string[]
      ).includes(file.type);

      if (!isAllowedMime) {
        showToast(
          'error',
          'Formato de arquivo nao permitido',
          'Por seguranca, selecione apenas imagens PNG, JPG ou WebP.'
        );
        return;
      }

      if (file.size > 4 * 1024 * 1024) {
        showToast(
          'error',
          'Imagem muito grande',
          'Escolha uma imagem com ate 4 MB para melhor nitidez.'
        );
        return;
      }

      const isValidBinary = await hasValidRasterMagicBytes(file);
      if (!isValidBinary) {
        showToast(
          'error',
          'Assinatura de arquivo invalida',
          'O arquivo enviado nao corresponde a uma imagem PNG, JPEG ou WebP integra.'
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setConfig((prev) => ({
            ...prev,
            logoDataUrl: result,
            level: 'H',
          }));
          showToast(
            'info',
            'Logo central aplicada',
            'Correcao de erro ajustada para Alta (H) para preservar a leitura.'
          );
        }
      };
      reader.readAsDataURL(file);
    },
    [showToast]
  );

  const removeLogo = useCallback(() => {
    setConfig((prev) => ({ ...prev, logoDataUrl: null }));
    showToast('info', 'Logo central removida');
  }, [showToast]);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_QR_CONFIG);
    showToast(
      'info',
      'Configuracoes restauradas',
      'O gerador voltou para o padrao inicial.'
    );
  }, [showToast]);

  const handleDownloadPng = useCallback(async () => {
    if (!qrContainerRef.current || isExporting) return;

    setIsExporting(true);
    try {
      await exportQrToPng(qrContainerRef.current, 'qrcode-pro.png');
      showToast(
        'success',
        'Download PNG concluido',
        'Imagem exportada em alta definicao (3x).'
      );
    } catch {
      showToast(
        'error',
        'Erro ao exportar PNG',
        'Verifique se a imagem central permite exportacao local.'
      );
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, showToast]);

  const handleDownloadSvg = useCallback(() => {
    if (!qrContainerRef.current) return;

    try {
      exportQrToSvg(qrContainerRef.current, config.bgColor, 'qrcode-pro.svg');
      showToast(
        'success',
        'Download SVG concluido',
        'Arquivo vetorial exportado com sucesso.'
      );
    } catch {
      showToast('error', 'Erro ao exportar SVG');
    }
  }, [config.bgColor, showToast]);

  const handleCopyImage = useCallback(async () => {
    if (!qrContainerRef.current || isExporting) return;

    setIsExporting(true);
    try {
      await copyQrImageToClipboard(qrContainerRef.current);
      showToast(
        'success',
        'QR Code copiado',
        'A imagem foi copiada para sua area de transferencia.'
      );
    } catch {
      try {
        await navigator.clipboard.writeText(payload);
        showToast(
          'info',
          'Conteudo copiado em texto',
          'Seu navegador nao suporta copia direta de imagem; copiamos o conteudo do QR.'
        );
      } catch {
        showToast('error', 'Nao foi possivel copiar');
      }
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, payload, showToast]);

  return {
    config,
    payload,
    contrast,
    isExporting,
    toast,
    qrContainerRef,
    dismissToast,
    setContentType,
    setUrlOrText,
    updateWifi,
    updateWhatsapp,
    updateEmail,
    setColors,
    swapColors,
    setLevel,
    setSize,
    setLogoSize,
    setLogoRounded,
    handleLogoUpload,
    removeLogo,
    resetConfig,
    handleDownloadPng,
    handleDownloadSvg,
    handleCopyImage,
  };
}
