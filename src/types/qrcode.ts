export type QrErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QrContentType = 'url' | 'wifi' | 'whatsapp' | 'email' | 'text';

export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

export interface WifiConfig {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface WhatsappConfig {
  phone: string;
  message: string;
}

export interface EmailConfig {
  email: string;
  subject: string;
  body: string;
}

export interface QrColorPreset {
  id: string;
  name: string;
  fgColor: string;
  bgColor: string;
}

export interface QrConfiguration {
  contentType: QrContentType;
  urlOrText: string;
  wifi: WifiConfig;
  whatsapp: WhatsappConfig;
  email: EmailConfig;
  fgColor: string;
  bgColor: string;
  size: number;
  level: QrErrorCorrectionLevel;
  includeMargin: boolean;
  logoDataUrl: string | null;
  logoSize: number;
  logoRounded: boolean;
}

export type ContrastStatus = 'excellent' | 'good' | 'poor';

export interface ContrastEvaluation {
  ratio: number;
  status: ContrastStatus;
  isInverted: boolean;
  message: string;
}

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}
