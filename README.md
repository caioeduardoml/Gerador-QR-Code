# QR Code Studio

Gerador de QR Code moderno, rápido e seguro, construído com React, TypeScript, Vite e Tailwind CSS. Permite criar, personalizar e exportar QR Codes em alta definição com validação de contraste em tempo real.

Site em produção: https://geradorqr-code.netlify.app/

---

## Funcionalidades

- **Múltiplos formatos de conteúdo:**
  - **Link / URL:** Geração direta com validação de protocolo seguro (`http:` / `https:`).
  - **Wi-Fi:** Configuração de SSID, senha (com ocultação visual), tipo de criptografia (`WPA/WPA2/WPA3`, `WEP`, aberta) e rede oculta.
  - **WhatsApp:** Link direto (`wa.me`) com número e mensagem automática opcional.
  - **E-mail:** Destinatário, assunto e corpo pré-preenchidos (`mailto:`).
  - **Texto / PIX:** Suporte a mensagens livres, códigos ou chaves PIX.
- **Personalização visual:**
  - Paletas de alto contraste pré-configuradas e seletores manuais para cor dos módulos e fundo, com botão de inversão rápida.
  - Controle de tamanho da visualização (`160px` a `280px`) e nível de correção de erro (`L`, `M`, `Q`, `H`).
- **Logo central:**
  - Upload de imagem central (`PNG`, `JPEG`, `WebP`) com ajuste de dimensão (`32px` a `64px`), moldura circular ou quadrada e ajuste automático do nível de correção de erro para `H` (30%).
- **Validador de contraste em tempo real:**
  - Cálculo de luminância relativa (padrão WCAG) exibindo o índice de contraste e alertas para combinações com baixa legibilidade ou cores invertidas.
- **Exportação:**
  - Download em **PNG** em alta definição (`pixelRatio: 3`).
  - Download em **SVG** vetorial.
  - Cópia direta da imagem do QR Code para a área de transferência.
- **Interface e Acessibilidade:**
  - Modo claro e modo escuro com persistência local.
  - Navegação por teclado, rótulos semânticos (`aria-*`), notificações toast e suporte a `prefers-reduced-motion`.

---

## Segurança

- **Validação de upload por Magic Bytes:** Apenas imagens raster `PNG`, `JPEG` e `WebP` com assinatura binária válida são aceitas como logo central, bloqueando arquivos `SVG` ou disfarçados.
- **Sanitização de URLs:** Bloqueio de esquemas perigosos (`javascript:`, `data:`, `vbscript:`, `file:`) no modo Link/URL.
- **Proteção contra overflow:** Limite máximo de caracteres nos campos e no payload (`900` caracteres) para evitar falhas de renderização por excesso de capacidade.
- **Privacidade na interface:** Campo de senha Wi-Fi mascarado e ocultação da senha no resumo textual de pré-visualização.
- **Cabeçalhos HTTP (`public/_headers`):** Configurado com `Content-Security-Policy` restritiva, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Permissions-Policy` e `Cross-Origin-Opener-Policy`.

---

## Tecnologias Utilizadas

- **React 19** e **TypeScript**
- **Vite** (com code splitting via `React.lazy` e `Suspense`)
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **react-qr-code** (renderização vetorial dos QR Codes)
- **html-to-image** (exportação PNG em alta resolução e cópia para área de transferência)

---

## Estrutura do Projeto

```text
├── public/
│   └── _headers                  # Cabecalhos de seguranca (CSP, HSTS, etc.)
├── src/
│   ├── assets/                   # Imagens estaticas
│   ├── components/               # Componentes reutilizaveis (Icons, SuspenseLoader, ToastNotification)
│   ├── features/
│   │   └── qr-generator/
│   │       ├── components/       # QrHeader, QrFooter, QrCustomizationForm, QrPreviewCard, QrGeneratorWorkspace
│   │       ├── helpers/          # qrPresets (validacao, contraste, payload) e qrExport (PNG, SVG, Clipboard)
│   │       └── hooks/            # useQrGenerator
│   ├── types/                    # Definicoes de tipos TypeScript (qrcode.ts)
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── tsconfig.app.json
└── vite.config.ts
```

---

## Como Rodar Localmente

Pré-requisito: [Node.js](https://nodejs.org/) instalado.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/caioeduardoml/Gerador-QR-Code.git
   cd Gerador-QR-Code
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Outros comandos disponíveis:**
   ```bash
   npm run build   # Compila TypeScript e gera o build de producao em dist/
   npm run lint    # Executa a verificacao do ESLint
   npm run preview # Visualiza o build de producao localmente
   ```

---

## Autor

Desenvolvido por **Caio Eduardo** ([@caioeduardoml](https://github.com/caioeduardoml)).
