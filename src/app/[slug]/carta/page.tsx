import { getRestaurantBySlug, getMenuItems, getMenuCategories } from "@/services/restaurant";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { ChevronLeft, Info, UtensilsCrossed, CalendarDays } from "lucide-react";
import BottomNav from "@/components/restaurant/BottomNav";
import RestaurantFooter from "@/components/restaurant/RestaurantFooter";
import MenuList from "@/components/restaurant/MenuList";
import { formatPrice } from "@/utils/format";

interface MenuPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  const categories = await getMenuCategories(restaurant.id) || [];
  const items = await getMenuItems(restaurant.id) || [];

  // Agrupar items por categoría
  const groupedItems = categories.map(cat => ({
    ...cat,
    items: items.filter(item => item.category_id === cat.id)
  })).filter(group => group.items.length > 0);


  return (
    <main className="min-h-screen bg-surface pb-28">
      {/* Header Sticky */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 px-4 h-14 flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
            <Link href={`/${slug}`}>
                <ChevronLeft size={20} />
            </Link>
        </Button>
        <h1 className="text-sm font-bold tracking-tight truncate max-w-[200px]">
          {restaurant.name}
        </h1>
        <div className="w-10" />
      </header>

      {/* Category Tabs (Scroll Horizontal) */}
      <nav className="sticky top-14 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20 flex overflow-x-auto py-3 px-4 gap-2 scroll-smooth">
        {groupedItems.map((category) => (
          <a
            key={category.id}
            href={`#cat-${category.id}`}
            className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-container text-xs font-bold text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all border border-outline-variant/20"
          >
            {category.name}
          </a>
        ))}
      </nav>

      {/* Hero Mini */}
      <div className="px-4 py-6">
          <div className="relative h-36 w-full rounded-[16px] overflow-hidden">
                {restaurant.banner_url ? (
                    <Image src={restaurant.banner_url} alt="Menu" fill className="object-cover opacity-60" />
                ) : (
                    <div className="w-full h-full gradient-primary opacity-20" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                    <h2 className="text-xl font-bold text-on-surface">Nuestra Carta</h2>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <Info size={12} /> Precios en CLP · IVA incluido
                    </p>
                </div>
          </div>
      </div>

      {/* Menu Content */}
      {groupedItems.length === 0 ? (
          <div className="px-4 py-20 text-center">
              <UtensilsCrossed size={40} className="mx-auto text-outline/20 mb-4" />
              <p className="text-on-surface-variant text-sm">Próximamente estaremos publicando nuestra carta.</p>
          </div>
      ) : (
          <MenuList groupedItems={groupedItems} />
      )}

      <RestaurantFooter />
      <BottomNav slug={slug} />
    </main>
  );
}
