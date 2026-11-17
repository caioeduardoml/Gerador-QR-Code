import { toPng, toBlob } from 'html-to-image';

export async function exportQrToPng(
  element: HTMLElement,
  filename = 'qrcode-personalizado.png'
): Promise<void> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 3,
  });

  const anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = dataUrl;
  anchor.click();
}

export function exportQrToSvg(
  containerElement: HTMLElement,
  bgColor: string,
  filename = 'qrcode-vetor.svg'
): void {
  const svgElement = containerElement.querySelector('svg');
  if (!svgElement) {
    throw new Error('Elemento SVG nao encontrado para exportacao.');
  }

  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clonedSvg.style.backgroundColor = bgColor;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(svgBlob);

  const anchor = document.createElement('a');
  anchor.download = filename;
  anchor.href = url;
  anchor.click();

  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function copyQrImageToClipboard(
  element: HTMLElement
): Promise<void> {
  const blob = await toBlob(element, {
    cacheBust: true,
    pixelRatio: 3,
  });

  if (!blob) {
    throw new Error('Nao foi possivel converter a imagem do QR Code.');
  }

  if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
    throw new Error('Area de transferencia de imagem nao suportada neste navegador.');
  }

  await navigator.clipboard.write([
    new ClipboardItem({
      'image/png': blob,
    }),
  ]);
}
