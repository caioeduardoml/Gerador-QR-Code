import type {
  ContrastEvaluation,
  QrColorPreset,
  QrConfiguration,
} from '~types/qrcode';

export const MAX_QR_PAYLOAD_LENGTH = 900;

export const ALLOWED_LOGO_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

export const QR_COLOR_PRESETS: QrColorPreset[] = [
  {
    id: 'classic',
    name: 'Classico',
    fgColor: '#0F172A',
    bgColor: '#FFFFFF',
  },
  {
    id: 'ocean-blue',
    name: 'Azul SaaS',
    fgColor: '#1D4ED8',
    bgColor: '#F8FAFC',
  },
  {
    id: 'indigo-pro',
    name: 'Indigo Pro',
    fgColor: '#3730A3',
    bgColor: '#EEF2FF',
  },
  {
    id: 'emerald-tech',
    name: 'Esmeralda',
    fgColor: '#065F46',
    bgColor: '#ECFDF5',
  },
  {
    id: 'crimson-bold',
    name: 'Carmim',
    fgColor: '#9F1239',
    bgColor: '#FFF1F2',
  },
  {
    id: 'slate-minimal',
    name: 'Grafite',
    fgColor: '#1E293B',
    bgColor: '#F1F5F9',
  },
];

export const DEFAULT_QR_CONFIG: QrConfiguration = {
  contentType: 'url',
  urlOrText: 'https://github.com/caioeduardoml',
  wifi: {
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  },
  whatsapp: {
    phone: '',
    message: '',
  },
  email: {
    email: '',
    subject: '',
    body: '',
  },
  fgColor: '#0F172A',
  bgColor: '#FFFFFF',
  size: 220,
  level: 'H',
  includeMargin: true,
  logoDataUrl: null,
  logoSize: 48,
  logoRounded: true,
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const sanitized = hex.replace('#', '').trim();
  if (sanitized.length === 3) {
    const r = parseInt(sanitized[0] + sanitized[0], 16);
    const g = parseInt(sanitized[1] + sanitized[1], 16);
    const b = parseInt(sanitized[2] + sanitized[2], 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
  }
  if (sanitized.length === 6) {
    const r = parseInt(sanitized.slice(0, 2), 16);
    const g = parseInt(sanitized.slice(2, 4), 16);
    const b = parseInt(sanitized.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const transform = (channel: number): number => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const r = transform(rgb.r);
  const g = transform(rgb.g);
  const b = transform(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function evaluateQrContrast(
  fgColor: string,
  bgColor: string
): ContrastEvaluation {
  const lumFg = getRelativeLuminance(fgColor);
  const lumBg = getRelativeLuminance(bgColor);

  const brightest = Math.max(lumFg, lumBg);
  const darkest = Math.min(lumFg, lumBg);
  const ratio = Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
  const isInverted = lumFg > lumBg;

  if (ratio < 3.0) {
    return {
      ratio,
      status: 'poor',
      isInverted,
      message:
        'Contraste baixo. Leitores de camera podem falhar ao escanear este codigo.',
    };
  }

  if (isInverted) {
    return {
      ratio,
      status: 'good',
      isInverted,
      message:
        'Cores invertidas (codigo mais claro que o fundo). Prefira codigo escuro em fundo claro para maior compatibilidade.',
    };
  }

  if (ratio >= 7.0) {
    return {
      ratio,
      status: 'excellent',
      isInverted: false,
      message: 'Excelente contraste para leitura rapida em qualquer camera.',
    };
  }

  if (ratio >= 4.5) {
    return {
      ratio,
      status: 'good',
      isInverted: false,
      message: 'Bom contraste (compativel com WCAG AA e leitores modernos).',
    };
  }

  return {
    ratio,
    status: 'poor',
    isInverted,
    message:
      'Contraste abaixo do recomendado (4.5:1). Aumente a diferenca entre o codigo e o fundo.',
  };
}

function escapeWifiField(value: string): string {
  return value.replace(/([\\;,:])/g, '\\$1');
}

export function sanitizeUrlPayload(rawInput: string): string {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return DEFAULT_QR_CONFIG.urlOrText;
  }

  const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return DEFAULT_QR_CONFIG.urlOrText;
    }
    return parsed.toString();
  } catch {
    return DEFAULT_QR_CONFIG.urlOrText;
  }
}

export async function hasValidRasterMagicBytes(file: File): Promise<boolean> {
  if (file.size < 12) return false;
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;

  // JPEG: FF D8 FF
  const isJpeg =
    bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

  // WebP: RIFF....WEBP
  const isWebp =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;

  return isPng || isJpeg || isWebp;
}

export function maskSensitivePayload(
  payload: string,
  contentType: QrConfiguration['contentType']
): string {
  if (contentType !== 'wifi') {
    return payload;
  }
  return payload.replace(/;P:([^;]*);/, (_match, pass: string) =>
    pass.length > 0 ? ';P:********;' : ';P:;'
  );
}

export function buildQrPayload(config: QrConfiguration): string {
  let result: string;

  switch (config.contentType) {
    case 'url': {
      result = sanitizeUrlPayload(config.urlOrText);
      break;
    }
    case 'text': {
      const trimmed = config.urlOrText.trim();
      result = trimmed.length > 0 ? trimmed : DEFAULT_QR_CONFIG.urlOrText;
      break;
    }
    case 'wifi': {
      const ssid = escapeWifiField(config.wifi.ssid.trim() || 'MinhaRedeWiFi');
      const pass = escapeWifiField(config.wifi.password);
      const enc = config.wifi.encryption;
      const hidden = config.wifi.hidden ? 'true' : 'false';
      result = `WIFI:T:${enc};S:${ssid};P:${pass};H:${hidden};;`;
      break;
    }
    case 'whatsapp': {
      const digits = config.whatsapp.phone.replace(/\D/g, '');
      const phone = digits.length > 0 ? digits : '5511999999999';
      const msg = config.whatsapp.message.trim();
      const query = msg ? `?text=${encodeURIComponent(msg)}` : '';
      result = `https://wa.me/${phone}${query}`;
      break;
    }
    case 'email': {
      const target = config.email.email.trim() || 'contato@exemplo.com';
      const params = new URLSearchParams();
      if (config.email.subject.trim()) {
        params.set('subject', config.email.subject.trim());
      }
      if (config.email.body.trim()) {
        params.set('body', config.email.body.trim());
      }
      const queryString = params.toString();
      result = queryString ? `mailto:${target}?${queryString}` : `mailto:${target}`;
      break;
    }
  }

  return result.slice(0, MAX_QR_PAYLOAD_LENGTH);
}
