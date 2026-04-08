import { getRestaurantBySlug } from "@/services/restaurant";
import { notFound } from "next/navigation";
import ReservationForm from "@/components/restaurant/ReservationForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui";
import BottomNav from "@/components/restaurant/BottomNav";
import RestaurantFooter from "@/components/restaurant/RestaurantFooter";

interface ReservarPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReservarPage({ params }: ReservarPageProps) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface px-4 pb-12">
      {/* Mini Header */}
      <header className="h-14 flex items-center justify-between sticky top-0 bg-surface/80 backdrop-blur-md z-40 mb-4 -mx-4 px-4">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link href={`/${slug}`}>
                <ChevronLeft size={20} />
            </Link>
        </Button>
        <span className="text-sm font-bold truncate max-w-[200px]">
          {restaurant.name}
        </span>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="max-w-md mx-auto">
        <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-1">Reserva una Mesa</h1>
            <p className="text-on-surface-variant text-sm">Gestiona tu reserva de forma rápida y sencilla.</p>
        </div>

        <ReservationForm 
            restaurantId={restaurant.id} 
            restaurantName={restaurant.name}
            slug={slug}
        />
      </div>

      <RestaurantFooter />
      <BottomNav slug={slug} />
    </main>
  );
}
