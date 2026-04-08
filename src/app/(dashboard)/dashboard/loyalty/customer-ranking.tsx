"use client";

import { Card, Badge, Button } from "@/components/ui";
import { 
  Users, 
  ChevronRight, 
  Star, 
  AlertCircle,
  Mail,
  Calendar,
  Zap,
  Network
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { grantManualReward } from "@/services/loyalty";

interface CustomerRankingProps {
  restaurantId: string;
  customers: any[];
}

export function CustomerRanking({ restaurantId, customers }: CustomerRankingProps) {
  
  const handleRescue = async (customerId: string, name: string) => {
    try {
      await grantManualReward(restaurantId, customerId, "¡Te extrañamos! Vuelve y obtén 20% de descuento", "win_back");
      toast.success(`Premio de rescate enviado a ${name}`);
    } catch (e) {
      toast.error("Error al enviar premio");
    }
  };

  // Ordenar por visitas (ranking por defecto)
  const ranked = [...customers].sort((a, b) => (b.total_visits || 0) - (a.total_visits || 0));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
         <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest flex items-center gap-2">
            <Star size={16} className="text-tertiary fill-tertiary" />
            Top Clientes
         </h3>
         <Badge variant="outline" className="border-outline-variant/30 text-[10px]">
            Total: {customers.length}
         </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {ranked.map((customer, i) => {
          const lastVisit = customer.last_visit_at ? new Date(customer.last_visit_at) : null;
          const isLost = lastVisit && (Date.now() - lastVisit.getTime() > 30 * 24 * 60 * 60 * 1000);
          
          return (
            <Card key={customer.id} className={`p-4 border-none bg-surface-container-low transition-all hover:bg-surface-container flex flex-col md:flex-row md:items-center justify-between gap-4 ${isLost ? 'ring-1 ring-error/20' : ''}`}>
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                   <div className="w-12 h-12 rounded-[14px] bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {i + 1}
                   </div>
                   {i < 3 && (
                      <div className="absolute -top-2 -left-2 bg-tertiary text-on-tertiary-container w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface">
                         <Star size={10} className="fill-current" />
                      </div>
                   )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-on-surface truncate">{customer.name}</h4>
                    {isLost && (
                       <Badge className="bg-error/10 text-error border-none text-[9px] uppercase tracking-tighter px-1 h-5">
                          Perdido (+30d)
                       </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <Zap size={12} className="text-primary" />
                      {customer.total_visits || 0} visitas
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={12} className="text-outline" />
                      {customer.email}
                    </span>
                    {lastVisit && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-outline" />
                        Vino hace {formatDistanceToNow(lastVisit, { locale: es })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-3 text-[11px] font-bold rounded-[10px] border-outline-variant/30 gap-1.5 hover:bg-primary/5"
                    onClick={() => toast.info("Funcionalidad de Red Social próximamente")}
                >
                  <Network size={14} />
                  Conexiones
                </Button>
                
                {isLost ? (
                  <Button 
                    size="sm" 
                    className="h-9 px-3 text-[11px] font-bold rounded-[10px] bg-error/10 text-error hover:bg-error/20 border-none"
                    onClick={() => handleRescue(customer.id, customer.name)}
                  >
                    Rescatar
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-3 text-[11px] font-bold rounded-[10px] border-outline-variant/30 text-on-surface-variant"
                  >
                    Gestionar
                    <ChevronRight size={14} className="ml-1 opacity-40" />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
