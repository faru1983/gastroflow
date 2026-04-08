"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button, Card, Badge, Input } from "@/components/ui";
import { 
  Scan, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  CreditCard, 
  Users, 
  Hash,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { registerVisit } from "@/services/loyalty";
import { createClient } from "@/lib/supabase/client";

interface ScannedCustomer {
  id: string;
  name: string;
  email: string;
}

export function ScannerClient({ restaurantId }: { restaurantId: string }) {
  const [scannedCustomers, setScannedCustomers] = useState<ScannedCustomer[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [amountTotal, setAmountTotal] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [partySize, setPartySize] = useState<string>("");
  const [issubmitting, setIsSubmitting] = useState(false);
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (isScanning) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(
        async (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.id && data.email) {
              handleScanSuccess(data.id, data.name, data.email);
            }
          } catch (e) {
            // Si no es JSON, intentamos tratarlo como un ID directo
            handleScanSuccess(decodedText, "Cargando...", "");
          }
          
          setIsScanning(false);
          scannerRef.current?.clear();
        },
        (error) => {
          // console.warn(error);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [isScanning]);

  const handleScanSuccess = async (id: string, name: string, email: string) => {
    // Evitar duplicados en la misma mesa
    if (scannedCustomers.find(c => c.id === id)) {
      toast.warning("Este cliente ya fue escaneado para esta mesa.");
      return;
    }

    // Buscamos datos reales si no vienen en el QR
    if (name === "Cargando...") {
        const { data } = await supabase.from("customers").select("id, name, email").eq("id", id).single();
        if (data) {
            setScannedCustomers(prev => [...prev, { id: data.id, name: data.name, email: data.email }]);
            toast.success(`Cliente ${data.name} agregado`);
        } else {
            toast.error("No se encontró el cliente en la base de datos.");
        }
    } else {
        setScannedCustomers(prev => [...prev, { id, name, email }]);
        toast.success(`Cliente ${name} agregado`);
    }
  };

  const removeCustomer = (id: string) => {
    setScannedCustomers(prev => prev.filter(c => c.id !== id));
  };

  const handleRegister = async () => {
    if (scannedCustomers.length === 0) {
      toast.error("Debes escanear al menos a un cliente.");
      return;
    }
    if (!amountTotal || !tableNumber) {
      toast.error("Mesa y Monto Total son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerVisit({
        restaurantId,
        customerIds: scannedCustomers.map(c => c.id),
        amountTotal: parseFloat(amountTotal),
        tableNumber,
        partySize: parseInt(partySize) || scannedCustomers.length
      });
      
      toast.success("¡Visita registrada con éxito!");
      setScannedCustomers([]);
      setAmountTotal("");
      setTableNumber("");
      setPartySize("");
    } catch (error: any) {
      toast.error("Error al registrar: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanner Control */}
      {!isScanning ? (
        <Button 
          onClick={() => setIsScanning(true)} 
          size="lg" 
          className="w-full h-32 flex-col gap-3 rounded-[24px] shadow-xl shadow-primary/20 border-2 border-primary/20 bg-linear-to-br from-primary to-primary-container"
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Scan size={28} className="text-white" />
          </div>
          <span className="text-base font-bold text-white">Escanear Cliente</span>
        </Button>
      ) : (
        <Card className="p-4 bg-black rounded-[24px] overflow-hidden">
          <div id="qr-reader" className="w-full" />
          <Button 
            variant="outline" 
            onClick={() => setIsScanning(false)} 
            className="w-full mt-4 border-white/20 text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
        </Card>
      )}

      {/* Scanned List */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <UserPlus size={16} className="text-primary" />
            Comensales en la mesa ({scannedCustomers.length})
        </h3>
        
        {scannedCustomers.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {scannedCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-[16px] animate-in slide-in-from-left duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{customer.name}</p>
                    <p className="text-[10px] text-on-surface-variant truncate max-w-[150px]">{customer.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeCustomer(customer.id)}
                  className="p-2 text-outline/40 hover:text-error transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border-2 border-dashed border-outline-variant/20 rounded-[20px] text-center">
             <p className="text-xs text-outline">Escanea los códigos de los clientes a quienes les sumarás visita.</p>
          </div>
        )}
      </section>

      {/* Sale Data Form */}
      {scannedCustomers.length > 0 && (
        <Card className="p-6 bg-surface-container-high/30 border-none rounded-[24px] space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-primary uppercase tracking-wider ml-1">Mesa</label>
                <div className="relative">
                   <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                   <Input 
                     placeholder="Ej: 12" 
                     className="pl-9 h-11 bg-surface-container rounded-[12px] border-none"
                     value={tableNumber}
                     onChange={(e) => setTableNumber(e.target.value)}
                   />
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-primary uppercase tracking-wider ml-1">Comensales</label>
                <div className="relative">
                   <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                   <Input 
                     type="number" 
                     placeholder="Ej: 4" 
                     className="pl-9 h-11 bg-surface-container rounded-[12px] border-none"
                     value={partySize}
                     onChange={(e) => setPartySize(e.target.value)}
                   />
                </div>
             </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-[11px] font-bold text-tertiary uppercase tracking-wider ml-1 text-amber-500">Monto Total de la Cuenta</label>
             <div className="relative">
                <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  className="pl-9 h-14 bg-surface-container rounded-[12px] border-none text-lg font-bold text-tertiary"
                  value={amountTotal}
                  onChange={(e) => setAmountTotal(e.target.value)}
                />
             </div>
          </div>

          {amountTotal && scannedCustomers.length > 0 && (
             <div className="p-3 bg-surface-container rounded-[14px] flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-medium">Gasto por persona:</span>
                <span className="text-sm font-bold text-primary">
                   ${(parseFloat(amountTotal) / scannedCustomers.length).toFixed(2)}
                </span>
             </div>
          )}

          <Button 
            onClick={handleRegister} 
            disabled={issubmitting}
            fullWidth 
            size="lg" 
            className="h-14 mt-4 rounded-[16px] text-base font-bold shadow-xl shadow-primary/10"
          >
            {issubmitting ? "Registrando..." : "Finalizar Registro"}
            {!issubmitting && <CheckCircle2 size={20} className="ml-2" />}
          </Button>
        </Card>
      )}
    </div>
  );
}
