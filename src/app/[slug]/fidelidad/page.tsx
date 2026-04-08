import { getRestaurantBySlug } from "@/services/restaurant";
import { notFound } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { Heart, Trophy, Gift, Star, ChevronLeft } from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/restaurant/BottomNav";
import RestaurantFooter from "@/components/restaurant/RestaurantFooter";

interface FidelidadPageProps {
  params: Promise<{ slug: string }>;
}

export default async function FidelidadPage({ params }: FidelidadPageProps) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href={`/${slug}`}>
            <ChevronLeft size={24} />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Club de Fidelidad</h1>
      </div>

      <div className="px-5 pb-20 max-w-md mx-auto">
        {/* Welcome Card */}
        <Card className="p-6 mb-6 bg-linear-to-br from-primary/20 to-primary/5 border-none rounded-[20px] text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                <Heart size={32} className="text-on-primary-container" />
            </div>
            <h2 className="text-xl font-bold mb-2">¡Bienvenido al Club!</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
                Únete a <strong>{restaurant.name}</strong> y comienza a ganar premios por cada visita.
            </p>
        </Card>

        {/* Benefits */}
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-outline uppercase tracking-wider px-1">Beneficios Exclusivos</h3>
            
            <div className="space-y-3">
                {[
                    { icon: Star, title: "1 Sello por visita", desc: "Acumula sellos en tu tarjeta digital" },
                    { icon: Gift, title: "Premios sorpresa", desc: "Desbloquea postres o bebidas gratis" },
                    { icon: Trophy, title: "Nivel VIP", desc: "Acceso a eventos y reservas prioritarias" }
                ].map((b, i) => (
                    <Card key={i} className="p-4 flex gap-4 border-none bg-surface-container-low rounded-[16px]">
                        <div className="w-10 h-10 rounded-[12px] bg-surface-container-high flex items-center justify-center shrink-0">
                            <b.icon size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-on-surface">{b.title}</p>
                            <p className="text-xs text-on-surface-variant font-medium">{b.desc}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        {/* Action */}
        <div className="mt-10">
            <Button fullWidth size="lg" className="h-14 rounded-[14px] text-base font-bold shadow-lg shadow-primary/20" asChild>
                <Link href={`/${slug}/perfil`}>
                    Comenzar Ahora
                </Link>
            </Button>
            <p className="text-[10px] text-center text-outline mt-3">
                Al unirte aceptas nuestros términos y condiciones de fidelidad.
            </p>
        </div>
      </div>

      <RestaurantFooter />
      <BottomNav slug={slug} />
    </main>
  );
}
