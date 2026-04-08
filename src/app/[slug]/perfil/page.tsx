import { getRestaurantBySlug } from "@/services/restaurant";
import { notFound } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { User, LogOut, ChevronLeft, Calendar, Award } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/restaurant/BottomNav";
import RestaurantFooter from "@/components/restaurant/RestaurantFooter";
import AuthForm from "@/components/restaurant/AuthForm";

interface PerfilPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PerfilPage({ params }: PerfilPageProps) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

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
        <h1 className="text-xl font-bold">Tu Perfil</h1>
      </div>

      <div className="px-5 pb-20 max-w-md mx-auto">
        {session ? (
          <div className="space-y-6">
            <div className="text-center py-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                    <User size={48} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{session.user.email?.split('@')[0]}</h2>
                <p className="text-sm text-on-surface-variant">{session.user.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-surface-container-low border-none flex flex-col items-center gap-2">
                    <Calendar size={20} className="text-primary" />
                    <span className="text-xs font-medium">Mis Reservas</span>
                    <span className="text-xl font-bold">0</span>
                </Card>
                <Card className="p-4 bg-surface-container-low border-none flex flex-col items-center gap-2">
                    <Award size={20} className="text-tertiary" />
                    <span className="text-xs font-medium">Puntos</span>
                    <span className="text-xl font-bold">0</span>
                </Card>
            </div>

            <Button 
                variant="outline" 
                fullWidth 
                className="mt-8 rounded-[12px] border-error/20 text-error hover:bg-error/5"
                asChild
            >
              <form action={`/api/auth/signout?next=/${slug}`} method="post">
                <button type="submit" className="flex items-center justify-center w-full">
                  <LogOut size={18} className="mr-2" />
                  Cerrar Sesión
                </button>
              </form>
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center py-8">
                <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6">
                    <User size={40} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">¡Hola!</h2>
                <p className="text-sm text-on-surface-variant mb-8">
                    Inicia sesión para ver tus reservas y puntos de fidelidad en <strong>{restaurant.name}</strong>.
                </p>
            </div>

            <AuthForm restaurantName={restaurant.name} restaurantId={restaurant.id} />
          </>
        )}
      </div>

      <RestaurantFooter />
      <BottomNav slug={slug} />
    </main>
  );
}
