import { useState, useRef } from 'react';
import {QRCode} from 'react-qr-code';
import { toPng } from 'html-to-image';
import avatar from "./assets/eu.jpeg";

function App() {
  const [link, setLink] = useState('https://google.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [image, setImage] = useState<string | null>(null);
  const qrRef = useRef(null);

  // Função para ler o arquivo de imagem do usuário
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]; 
  if (file) {
    const reader = new FileReader();
    
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setImage(result);
      }
    };
    reader.readAsDataURL(file);
  }
};

  const downloadQR = () => {
    if (qrRef.current) {
      toPng(qrRef.current).then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'meu-qrcode.png';
        link.href = dataUrl;
        link.click();
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-10 font-sans text-gray-800">
      <header className="w-full max-w-md flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-indigo-600">GitHub: @naoexistenao</h1>
        <img 
          src={avatar}
          alt="Avatar" 
          className="w-20 h-25 rounded-full border-2 border-indigo-200"
        />
      </header>
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-indigo-600 text-center">
        Gerador QR Code
      </h1>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-6">
        
        {/* Contêiner Pai com relative para posicionar a imagem */}
        <div ref={qrRef} className="relative flex justify-center p-4 bg-white">
          <QRCode value={link} fgColor={fgColor} bgColor={bgColor} size={200} />
          
          {/* Imagem Centralizada com absolute */}
          {image && (
            <img 
              src={image} 
              alt="Centro" 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white bg-white"
            />
          )}
        </div>

        {/* Inputs */}
        <input 
          type="text" 
          placeholder="Cole seu link aqui..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          onChange={(e) => setLink(e.target.value)}
        />

        {/* Input de Imagem */}
        <div>
          <label className="block text-sm font-medium mb-1">Imagem Central</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            className="w-full p-2 border rounded-lg cursor-pointer text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Cor do Código</label>
            <input type="color" className="w-full h-10 cursor-pointer" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Cor de Fundo</label>
            <input type="color" className="w-full h-10 cursor-pointer" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </div>
        </div>

        <button 
          onClick={downloadQR}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Baixar QR Code
        </button>
      </div>
      <footer className="mt-auto pt-10 pb-4 text-center text-gray-500 text-sm">
        <p>Desenvolvido por</p>
        <p className="font-bold text-indigo-600">Caio Eduardo</p>
      </footer>
    </div>
  );
}

export default App;