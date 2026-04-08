"use client";

import { useEffect, useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { 
  Button, 
  Card 
} from "@/components/ui";
import { 
  Download, 
  Share2, 
  Printer, 
  ExternalLink,
  Info
} from "lucide-react";

interface QRClientProps {
  slug: string;
  name: string;
  logoUrl?: string | null;
}

export function QRClient({ slug, name, logoUrl }: QRClientProps) {
  const [publicUrl, setPublicUrl] = useState("");
  const qrRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Definimos la URL de la carta pública basándonos en el origen actual
    setPublicUrl(`${window.location.origin}/carta/${slug}`);
  }, [slug]);

  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 1000; // Alta resolución para impresión
      canvas.height = 1000;
      ctx?.drawImage(img, 0, 0, 1000, 1000);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_Gastroflow_${slug}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">Mi Código QR</h1>
        <p className="text-sm text-on-surface-variant italic">Este código lleva a tus clientes directamente a tu carta digital.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* QR Preview Card */}
        <Card className="p-8 flex flex-col items-center justify-center bg-white border-none shadow-xl">
            <div className="p-4 bg-white rounded-xl shadow-inner border border-outline-variant/10">
                <QRCodeSVG
                    id="qr-code"
                    ref={qrRef}
                    value={publicUrl}
                    size={280}
                    level="H" // Alta corrección de errores para poder poner el logo
                    includeMargin={false}
                    imageSettings={logoUrl ? {
                      src: logoUrl,
                      x: undefined,
                      y: undefined,
                      height: 60,
                      width: 60,
                      excavate: true,
                    } : undefined}
                />
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-lg font-bold text-gray-900">{name}</p>
                <p className="text-xs text-gray-500 font-mono mt-1 opacity-70">{publicUrl}</p>
            </div>
        </Card>

        {/* Actions & Settings */}
        <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex gap-3">
                <Info className="text-primary shrink-0" size={20} />
                <p className="text-xs text-primary/80 leading-relaxed">
                    <strong>Consejo Gastroflow:</strong> Descarga este código en alta resolución. Puedes imprimirlo en adhesivos para tus mesas, menús físicos o incluso en la entrada de tu local.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <Button fullWidth onClick={downloadQR} className="h-12 shadow-lg shadow-primary/20">
                    <Download size={18} className="mr-2" /> Descargar PNG en Alta Calidad
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" fullWidth onClick={() => window.print()} className="h-11">
                        <Printer size={18} className="mr-2" /> Imprimir
                    </Button>
                    <Button 
                        variant="outline" 
                        fullWidth 
                        onClick={() => window.open(publicUrl, "_blank")}
                        className="h-11"
                    >
                        <ExternalLink size={18} className="mr-2" /> Ver Carta
                    </Button>
                </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/20">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Preguntas Frecuentes</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold text-on-surface">¿Puedo cambiar el logo del centro?</h4>
                        <p className="text-xs text-on-surface-variant mt-1">Sí, actualiza tu logo en la configuración del restaurante y el QR se regenerará automáticamente.</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-on-surface">¿El QR cambia si añado nuevos platos?</h4>
                        <p className="text-xs text-on-surface-variant mt-1">No, el código es permanente. Tus clientes verán siempre la carta actualizada sin que tengas que cambiar el QR físico.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
