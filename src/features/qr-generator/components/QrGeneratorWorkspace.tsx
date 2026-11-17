import React from 'react';
import { useQrGenerator } from '~features/qr-generator/hooks/useQrGenerator';
import { QrCustomizationForm } from '~features/qr-generator/components/QrCustomizationForm';
import { QrPreviewCard } from '~features/qr-generator/components/QrPreviewCard';
import { ToastNotification } from '~components/ToastNotification';

export const QrGeneratorWorkspace: React.FC = () => {
  const {
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
  } = useQrGenerator();

  return (
    <>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <QrCustomizationForm
            config={config}
            onSelectContentType={setContentType}
            onChangeUrlOrText={setUrlOrText}
            onUpdateWifi={updateWifi}
            onUpdateWhatsapp={updateWhatsapp}
            onUpdateEmail={updateEmail}
            onSelectColors={setColors}
            onSwapColors={swapColors}
            onChangeLevel={setLevel}
            onChangeSize={setSize}
            onUploadLogo={handleLogoUpload}
            onRemoveLogo={removeLogo}
            onChangeLogoSize={setLogoSize}
            onChangeLogoRounded={setLogoRounded}
          />
        </div>

        <div className="lg:col-span-5">
          <QrPreviewCard
            config={config}
            payload={payload}
            contrast={contrast}
            isExporting={isExporting}
            qrContainerRef={qrContainerRef}
            onDownloadPng={handleDownloadPng}
            onDownloadSvg={handleDownloadSvg}
            onCopyImage={handleCopyImage}
            onReset={resetConfig}
          />
        </div>
      </div>

      <ToastNotification toast={toast} onDismiss={dismissToast} />
    </>
  );
};

export default QrGeneratorWorkspace;
