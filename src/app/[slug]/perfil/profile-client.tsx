"use client";

import { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { 
  Gift, 
  MapPin, 
  ChevronRight, 
  Star, 
  History, 
  User, 
  QrCode,
  CheckCircle2,
  Calendar,
  X
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ProfileClientProps {
  restaurant: any;
  customer: any;
  rewards: any[];
  visits: any[];
  session: any;
}

export function ProfileClient({ restaurant, customer, rewards, visits, session }: ProfileClientProps) {
  const [showQR, setShowQR] = useState(false);

  // Si no hay sesión o no es cliente registrado, mostramos la invitación
  if (!session || !customer) {
    return (
      <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-[20px] gradient-primary flex items-center justify-center mb-6 shadow-2xl shadow-primary/20">
          <Gift size={40} className="text-on-primary-container" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-2">¡Únete al Club {restaurant.name}!</h1>
        <p className="text-on-surface-variant text-sm mb-8 max-w-xs">
          Registra tus visitas, acumula sellos y canjea premios exclusivos cada vez que nos visites.
        </p>
        
        <div className="space-y-4 w-full max-w-xs">
          <Button asChild className="w-full h-12 text-base font-bold rounded-[12px]">
            <Link href={`/register?restaurant_id=${restaurant.id}&redirect=/${restaurant.slug}/perfil`}>
              Crear mi cuenta gratis
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full h-12 text-base font-medium rounded-[12px]">
            <Link href={`/login?redirect=/${restaurant.slug}/perfil`}>
              Ya soy socio, iniciar sesión
            </Link>
          </Button>
        </div>
        
        <Link href={`/${restaurant.slug}`} className="mt-8 text-xs text-outline flex items-center gap-1">
          Volver a la carta del restaurante
        </Link>
      </main>
    );
  }

  const stampsTarget = restaurant.loyalty_stamps_target || 10;
  const currentStamps = (customer.total_visits || 0) % stampsTarget;

  return (
    <main className="min-h-screen bg-surface pb-24">
      {/* Header Branded */}
      <div className="bg-surface-container-low px-6 pt-12 pb-6 rounded-b-[32px] border-b border-outline-variant/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <User size={20} />
             </div>
             <div>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Socio Gastroflow</p>
                <h2 className="text-lg font-bold text-on-surface">{customer.name}</h2>
             </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowQR(true)} className="rounded-[10px] border-outline-variant/30 gap-1.5 h-9 bg-surface-container-high">
            <QrCode size={16} className="text-primary" />
            <span className="text-xs font-semibold">Mi QR</span>
          </Button>
        </div>

        {/* Stamps Card */}
        <Card className="bg-linear-to-br from-surface-container to-surface-container-low border-outline-variant/20 p-5 rounded-[24px] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
             <Star size={80} className="text-primary" />
          </div>
          
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div>
               <h3 className="text-sm font-bold text-on-surface mb-1">Tu progreso de sellos</h3>
               <p className="text-xs text-on-surface-variant">Llevas {currentStamps} de {stampsTarget} visitas</p>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30 py-1 bg-primary/10">
                {stampsTarget - currentStamps} faltan
            </Badge>
          </div>

          <div className="grid grid-cols-5 gap-3 relative z-10">
            {Array.from({ length: stampsTarget }).map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-[10px] flex items-center justify-center border-2 transition-all ${
                  i < currentStamps 
                    ? "bg-primary border-primary text-on-primary-container shadow-md shadow-primary/20 scale-[1.05]" 
                    : "bg-surface-container-high border-outline-variant/20 text-outline/30"
                }`}
              >
                {i < currentStamps ? (
                  <CheckCircle2 size={24} strokeWidth={2.5} />
                ) : (
                  <Star size={20} />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-5 pt-4 border-t border-outline-variant/10 flex items-center gap-2">
             <div className="p-1.5 rounded-full bg-tertiary/20 text-tertiary">
                <Gift size={14} />
             </div>
             <p className="text-[11px] text-on-surface-variant leading-tight">
                Al llegar a {stampsTarget} visitas: <span className="text-tertiary font-bold">{restaurant.loyalty_stamps_reward_text}</span>
             </p>
          </div>
        </Card>
      </div>

      <div className="px-6 mt-8 space-y-8">
        {/* Rewards Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-base font-bold text-on-surface">Mis Premios</h3>
             <Badge className="bg-tertiary text-on-tertiary-container">{rewards.length}</Badge>
          </div>
          
          {rewards.length > 0 ? (
            <div className="space-y-3">
               {rewards.map((reward) => (
                 <Card key={reward.id} className="p-4 border-none bg-surface-container-low flex items-center justify-between rounded-[20px] active:scale-[0.98] transition-transform">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[14px] bg-tertiary/10 flex items-center justify-center text-tertiary">
                         <Gift size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] text-tertiary font-bold uppercase tracking-wider">{reward.reward_type}</p>
                         <p className="text-sm font-bold text-on-surface">{reward.reward_text}</p>
                      </div>
                   </div>
                   <ChevronRight size={18} className="text-outline/40" />
                 </Card>
               ))}
            </div>
          ) : (
            <div className="bg-surface-container-low/50 border-2 border-dashed border-outline-variant/20 rounded-[20px] p-8 text-center">
               <p className="text-xs text-outline">No tienes premios pendientes. ¡Sigue visitándonos!</p>
            </div>
          )}
        </section>

        {/* History Section */}
        <section>
          <h3 className="text-base font-bold text-on-surface mb-4">Últimas Visitas</h3>
          <div className="space-y-2">
            {visits.length > 0 ? (
              visits.map((visit) => (
                <div key={visit.id} className="flex items-center justify-between py-3 border-b border-outline-variant/10 last:border-0 text-sm">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                         <Calendar size={14} />
                      </div>
                      <div>
                         <p className="font-medium text-on-surface">
                            {format(new Date(visit.created_at), "PPP", { locale: es })}
                         </p>
                         <p className="text-[10px] text-on-surface-variant">Gasto: ${visit.amount}</p>
                      </div>
                   </div>
                   <Badge variant="outline" className="text-[10px] py-0 border-outline-variant/30">+1 Sello</Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-outline text-center py-4">Aún no registras visitas.</p>
            )}
          </div>
        </section>
      </div>

      {/* QR Backdrop Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-surface/90 backdrop-blur-md" onClick={() => setShowQR(false)} />
           <div className="bg-surface-container border border-outline-variant/30 w-full max-w-xs rounded-[32px] p-8 relative z-10 shadow-2xl scale-in-center">
              <button 
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-6">
                 <h3 className="text-lg font-bold text-on-surface">Muéstrale esto al Garzón</h3>
                 <p className="text-xs text-on-surface-variant mt-1">Para registrar tu visita y sellos</p>
              </div>

              <div className="bg-white p-4 rounded-[20px] shadow-inner mb-6 flex items-center justify-center">
                 <QRCodeSVG 
                   value={JSON.stringify({ 
                    id: customer.id, 
                    email: customer.email,
                    name: customer.name,
                    ts: Date.now() 
                   })} 
                   size={200}
                   level="H" 
                 />
              </div>

              <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-[14px]">
                 <CheckCircle2 size={16} className="text-primary" />
                 <span className="text-xs font-bold text-primary">Cargando perfil socio...</span>
              </div>
           </div>
        </div>
      )}

      {/* Persistent Navigation Placeholder (Footer bar if needed) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/80 backdrop-blur-xl border-t border-outline-variant/10 z-40">
         <Button asChild fullWidth className="h-12 rounded-[14px] font-bold shadow-lg shadow-primary/20">
            <Link href={`/${restaurant.slug}`}>
               Volver al Restaurante
            </Link>
         </Button>
      </div>
    </main>
  );
}
