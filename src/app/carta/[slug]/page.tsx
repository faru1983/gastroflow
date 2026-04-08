import { createClient } from "@/lib/supabase/server";
import { getRestaurantBySlug, getMenuItems, getMenuCategories } from "@/services/restaurant";
import { notFound } from "next/navigation";
import { 
  UtensilsCrossed, 
  MapPin, 
  Phone, 
  Clock,
  ChevronRight,
  Info
} from "lucide-react";
import Image from "next/image";

export default async function PublicMenuPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  const [categories, items] = await Promise.all([
    getMenuCategories(restaurant.id),
    getMenuItems(restaurant.id)
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero / Header del Restaurante */}
      <div className="relative h-48 bg-slate-900 overflow-hidden">
        {restaurant.banner_url ? (
            <img 
                src={restaurant.banner_url} 
                alt={restaurant.name} 
                className="w-full h-full object-cover opacity-60"
            />
        ) : (
            <div className="w-full h-full gradient-primary opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
            <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-lg shrink-0 overflow-hidden border-2 border-primary/20">
                {restaurant.logo_url ? (
                    <img src={restaurant.logo_url} alt={restaurant.name} className="w-full h-full object-contain" />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <UtensilsCrossed className="text-primary/30" size={24} />
                    </div>
                )}
            </div>
            <div className="min-w-0">
                <h1 className="text-xl font-bold text-white tracking-tight leading-tight truncate">{restaurant.name}</h1>
                <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {restaurant.address || "Dirección no disponible"}
                </p>
            </div>
        </div>
      </div>

      {/* Stats / Info Quick Bar */}
      <div className="flex items-center justify-around bg-white py-3 border-b border-slate-100 shadow-sm sticky top-0 z-10 overflow-x-auto px-4 gap-6 no-scrollbar">
        {categories.map((cat) => (
            <a 
                key={cat.id} 
                href={`#${cat.id}`} 
                className="text-xs font-bold text-slate-500 whitespace-nowrap hover:text-primary transition-colors uppercase tracking-wider h-8 flex items-center px-1 border-b-2 border-transparent hover:border-primary"
            >
                {cat.name}
            </a>
        ))}
      </div>

      {/* Menu Sections */}
      <main className="max-w-xl mx-auto p-4 space-y-10 pb-24">
        {categories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-16">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">{category.name}</h2>
                    <div className="h-0.5 flex-1 bg-slate-200/50 rounded-full" />
                </div>

                <div className="space-y-4">
                    {items
                        .filter(item => item.category_id === category.id)
                        .map((item) => (
                            <div key={item.id} className="bg-white p-3 rounded-[12px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100/50 flex gap-4 active:scale-[0.98] transition-transform">
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-[14px] font-bold text-slate-900 leading-snug">{item.name}</h3>
                                        <span className="text-[14px] font-black text-tertiary shrink-0">
                                            ${item.price.toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </p>
                                    
                                    {/* Indicadores opcionales (Picante, Veggie, etc) */}
                                    <div className="flex gap-2 mt-2">
                                        {/* Mock de tags */}
                                        {item.id.length % 3 === 0 && <span className="text-[9px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-amber-100">Popular</span>}
                                        {item.id.length % 5 === 0 && <span className="text-[9px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-green-100">Veggie</span>}
                                    </div>
                                </div>
                                {item.image_url && (
                                    <div className="w-20 h-20 rounded-[10px] overflow-hidden shrink-0 border border-slate-100">
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        ))}
                    {items.filter(item => item.category_id === category.id).length === 0 && (
                        <p className="text-xs text-slate-400 italic text-center py-4">No hay platos disponibles en esta categoría.</p>
                    )}
                </div>
            </section>
        ))}

        {/* Footer info del restaurante */}
        <section className="pt-10 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Información del Local</h3>
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                    <Clock size={16} className="text-primary" />
                    <span>Lunes a Sábado: 12:30 - 23:00</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                    <Phone size={16} className="text-primary" />
                    <span>{restaurant.phone || "Sin teléfono registrado"}</span>
                </div>
            </div>
            
            <div className="mt-8 p-4 bg-slate-900 rounded-[16px] text-center shadow-lg shadow-slate-200">
                <p className="text-xs text-slate-400 mb-2">¿Te gusta lo que ves?</p>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-white font-bold text-sm tracking-tighter">Powered by</span>
                    <span className="text-primary font-black text-sm tracking-tighter uppercase italic">Gastroflow</span>
                </div>
            </div>
        </section>
      </main>

      {/* Floating Action Button (Reserva) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-20">
        <a 
            href={`/${slug}/reservar`}
            className="flex items-center justify-between bg-primary text-on-primary-container p-4 rounded-full shadow-[0_10px_30px_-10px_rgba(41,161,149,0.5)] font-bold transition-all active:scale-95 active:shadow-none"
        >
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-1.5 rounded-full">
                    <UtensilsCrossed size={18} />
                </div>
                <span>Reservar una mesa</span>
            </div>
            <ChevronRight size={20} />
        </a>
      </div>
    </div>
  );
}
