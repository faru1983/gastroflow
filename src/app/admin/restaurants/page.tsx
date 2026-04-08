import { createAdminClient } from "@/lib/supabase/admin";
import { Card, Badge, Button } from "@/components/ui";
// ... (rest of lucide imports)
import { 
  Building2, 
  ChevronRight, 
  Calendar, 
  CreditCard,
  ExternalLink,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function AdminRestaurantsPage() {
  const supabase = createAdminClient();

  // Obtener todos los restaurantes con sus suscripciones
  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select(`
      *,
      subscriptions (
        plan,
        status,
        current_period_end
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8 text-error">Error al cargar restaurantes: {error.message}</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header con Buscador */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">Restaurantes</h1>
          <p className="text-on-surface-variant flex items-center gap-2">
            <Building2 size={16} />
            {restaurants?.length} locales registrados en la plataforma
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
           <input 
              type="text" 
              placeholder="Buscar por nombre o slug..." 
              className="w-full h-11 pl-10 pr-4 rounded-[12px] bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-tertiary/20"
           />
        </div>
      </div>

      {/* Grid de Restaurantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {restaurants?.map((restaurant) => {
          const createdAt = restaurant.created_at ? new Date(restaurant.created_at) : new Date();
          const trialEnds = restaurant.trial_ends_at ? new Date(restaurant.trial_ends_at) : new Date();
          const isExpired = new Date() > trialEnds && restaurant.plan === 'trial';

          return (
            <Card key={restaurant.id} className="p-0 border-none bg-surface-container-low overflow-hidden group hover:ring-2 hover:ring-tertiary/30 transition-all flex flex-col h-full">
              {/* Card Header con Estado */}
              <div className="p-5 border-b border-outline-variant/20 flex items-start justify-between bg-surface-container/30">
                <div className="w-12 h-12 rounded-[14px] bg-white/5 border border-outline-variant/20 flex items-center justify-center overflow-hidden">
                  {restaurant.logo_url ? (
                    <img src={restaurant.logo_url} alt={restaurant.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={24} className="text-tertiary/40" />
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                   <Badge 
                      variant="outline" 
                      className={`uppercase text-[10px] tracking-widest px-2 h-6 border-none ${
                        restaurant.plan === 'pro' ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'
                      }`}
                   >
                      Plan {restaurant.plan}
                   </Badge>
                   {isExpired ? (
                      <Badge className="bg-error/10 text-error border-none text-[9px] uppercase px-1.5 h-5">Vencido</Badge>
                   ) : (
                      <Badge className="bg-success/10 text-success border-none text-[9px] uppercase px-1.5 h-5">Activo</Badge>
                   )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-on-surface group-hover:text-tertiary transition-colors leading-tight">
                    {restaurant.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-mono mt-1 opacity-60">
                    @{restaurant.slug}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-tighter text-outline font-bold">Registro</span>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface font-medium">
                         <Calendar size={14} className="text-outline" />
                         {format(createdAt, "dd MMM yyyy", { locale: es })}
                      </div>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-tighter text-outline font-bold">Expiración Trial</span>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface font-medium">
                         <CreditCard size={14} className="text-outline" />
                         {format(trialEnds, "dd MMM yyyy", { locale: es })}
                      </div>
                   </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-surface-container/50 border-t border-outline-variant/20 flex items-center gap-2">
                 <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-9 rounded-[10px] border-outline-variant/30 text-xs gap-1.5"
                    asChild
                 >
                    <a href={`/${restaurant.slug}`} target="_blank" rel="noopener noreferrer">
                       <ExternalLink size={14} />
                       Ver Sitio
                    </a>
                 </Button>
                 <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-9 rounded-[10px] border-outline-variant/30 text-xs gap-1.5 hover:bg-tertiary/10"
                 >
                    Gestionar
                    <ChevronRight size={14} />
                 </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
