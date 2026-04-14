import { getRestaurantBySlug } from "@/services/restaurant";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  UtensilsCrossed, 
  CalendarDays, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Globe,
  ChevronRight,
  Clock,
  Heart
} from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import RestaurantFooter from "@/components/restaurant/RestaurantFooter";

interface RestaurantLandingProps {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantLandingPage({ params }: RestaurantLandingProps) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  // Parsear horarios
  const openingHours = restaurant.opening_hours as Record<string, string> | null;

  // Días en orden para mostrar
  const daysOrder = [
    { key: "lunes", label: "Lunes" },
    { key: "martes", label: "Martes" },
    { key: "miercoles", label: "Miércoles" },
    { key: "jueves", label: "Jueves" },
    { key: "viernes", label: "Viernes" },
    { key: "sabado", label: "Sábado" },
    { key: "domingo", label: "Domingo" },
  ];

  return (
    <>
      {/* Hero / Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        {restaurant.banner_url ? (
          <Image
            src={restaurant.banner_url}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full gradient-primary opacity-30" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/50 to-transparent" />
        
        {/* Floating Logo */}
        <div className="absolute bottom-4 left-6 z-10 transition-transform active:scale-95">
          <div className="w-20 h-20 rounded-xl bg-surface-container flex items-center justify-center border-4 border-surface shadow-2xl overflow-hidden relative">
            {restaurant.logo_url ? (
              <Image src={restaurant.logo_url} alt={restaurant.name} fill className="object-cover" />
            ) : (
              <UtensilsCrossed size={32} className="text-primary" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-10 pb-24 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              {restaurant.name}
            </h1>
            <Badge variant="success" size="sm">Abierto</Badge>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {restaurant.description || "Bienvenidos a nuestra experiencia gastronómica única."}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button asChild size="lg" className="h-20 flex-col gap-1 items-center justify-center rounded-xl shadow-lg shadow-primary/10">
            <Link href={`/${slug}/carta`}>
                <UtensilsCrossed size={20} />
                <span className="text-xs font-bold">Ver Carta</span>
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="h-20 flex-col gap-1 items-center justify-center rounded-xl border-outline-variant/30">
            <Link href={`/${slug}/reserva`}>
                <CalendarDays size={20} className="text-tertiary" />
                <span className="text-xs font-bold">Reservar</span>
            </Link>
          </Button>
        </div>

        {/* Loyalty Program CTA */}
        {restaurant.loyalty_stamps_reward_enabled && (
          <Card className="p-4 mb-10 border-none bg-linear-to-br from-primary/10 to-primary/5 rounded-xl relative overflow-hidden group active:scale-[0.98] transition-all">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
            <Link href={`/${slug}/fidelidad`} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[12px] bg-primary flex items-center justify-center text-on-primary-container shadow-lg shadow-primary/20">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">Club de Fidelidad</h3>
                  <p className="text-[11px] text-on-surface-variant">Gana sellos y premios en cada visita</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-primary" />
            </Link>
          </Card>
        )}

        {/* Info Sections */}
        <div className="space-y-3">

          {/* Opening Hours */}
          {openingHours && Object.keys(openingHours).length > 0 && (
            <Card className="p-4 border-none bg-surface-container-low">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                   <Clock size={16} className="text-tertiary" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-tertiary uppercase tracking-wider mb-2">Horarios</p>
                  <div className="space-y-1.5">
                    {daysOrder.map(({ key, label }) => {
                      const hours = openingHours?.[key];
                      return (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-on-surface-variant">{label}</span>
                          <span className={`${hours ? 'text-on-surface font-medium' : 'text-error/70 font-bold'} tabular-nums`}>
                            {hours || "Cerrado"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Ubicación y Reseñas Google */}
          <div className="mb-8 p-1">
            <h3 className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-4">Ubicación y Calificación</h3>
            <Card className="p-5 border-none bg-surface-container-low rounded-xl overflow-hidden relative group">
                <div className="flex justify-between items-start mb-4">
                    <a 
                      href={restaurant.google_maps_review_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all border border-outline-variant/20">
                            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#4285F4">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.85 0-5.27-1.92-6.14-4.51H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.86 14.09c-.22-.67-.35-1.38-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.68-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.68 2.84c.87-2.6 3.29-4.53 6.14-4.53z" fill="#EA4335" />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="text-xl font-black">{restaurant.google_rating || '5.0'}</span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={14} className={`${s <= (restaurant.google_rating || 5) ? 'fill-tertiary text-tertiary' : 'text-outline-variant'}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Calificación en Google</p>
                        </div>
                    </a>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-surface-container rounded-[16px]">
                    <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium leading-tight mb-1">{restaurant.address || 'Chile'}</p>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address || '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-primary"
                        >
                            Ver en el mapa
                        </a>
                    </div>
                </div>
            </Card>
          </div>

          {/* Social Icons Bar */}
          <div className="mb-10 text-center">
            <h3 className="text-[10px] font-bold text-outline uppercase tracking-[0.3em] mb-5">Redes y Contacto</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                restaurant.whatsapp_number && {
                  href: `https://wa.me/${restaurant.whatsapp_number.replace(/\+/g, '')}`,
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  ),
                  color: "#25D366",
                  bgColor: "rgba(37, 211, 102, 0.1)"
                },
                restaurant.instagram_url && {
                  href: restaurant.instagram_url,
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.247 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.247-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.247-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.247 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.355 2.618 6.778 6.98 6.978 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324A4.162 4.162 0 0112 16zM18.406 4.41a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
                    </svg>
                  ),
                  color: "#E1306C",
                  bgColor: "rgba(225, 48, 108, 0.1)"
                },
                restaurant.facebook_url && {
                  href: restaurant.facebook_url,
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                  color: "#1877F2",
                  bgColor: "rgba(24, 119, 242, 0.1)"
                },
                restaurant.tiktok_url && {
                  href: restaurant.tiktok_url,
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13-.08-.25-.17-.38-.25-.01 3.03.01 6.07-.02 9.11-.03 1.5-.31 3.04-1.03 4.39-.77 1.48-2.02 2.65-3.51 3.32-1.49.66-3.13.91-4.72.78-1.5-.12-3.04-.63-4.22-1.57C2.7 21.05 1.69 19 1.46 16.94c-.13-1.4-.04-2.85.5-4.16.63-1.54 1.78-2.84 3.25-3.61 1.09-.59 2.33-.87 3.57-.91.02 1.37.01 2.74.01 4.11-1.03.11-2.03.55-2.69 1.35-.61.83-.87 1.94-.64 2.94.22 1.01.91 1.93 1.83 2.37 1.02.48 2.27.42 3.23-.19.82-.53 1.32-1.45 1.35-2.42.06-2.9.02-5.79.02-8.69-.02-2.58-.04-5.16-.02-7.74z" />
                    </svg>
                  ),
                  color: "#000000",
                  bgColor: "rgba(0, 0, 0, 0.1)"
                },
                restaurant.contact_phone && {
                  href: `tel:${restaurant.contact_phone}`,
                  icon: <Phone size={20} strokeWidth={2.5} />,
                  color: "var(--primary)",
                  bgColor: "color-mix(in srgb, var(--primary) 10%, transparent)"
                },
                restaurant.contact_email && {
                  href: `mailto:${restaurant.contact_email}`,
                  icon: <Mail size={20} strokeWidth={2.5} />,
                  color: "var(--primary)",
                  bgColor: "color-mix(in srgb, var(--primary) 10%, transparent)"
                },
                restaurant.website && {
                  href: restaurant.website,
                  icon: <Globe size={20} strokeWidth={2.5} />,
                  color: "var(--primary)",
                  bgColor: "color-mix(in srgb, var(--primary) 10%, transparent)"
                }
              ].filter(Boolean).map((item: any, idx) => (
                <a 
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 flex items-center justify-center transition-all duration-300"
                  style={{ 
                    '--accent-color': item.color,
                    '--bg-soft': item.bgColor 
                  } as React.CSSProperties}
                >
                  <div className="absolute inset-0 bg-[var(--bg-soft)] rounded-xl border border-white/5 shadow-sm group-hover:shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:scale-105" />
                  <div className="relative z-10 text-[var(--accent-color)] group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RestaurantFooter />
    </>
  );
}
