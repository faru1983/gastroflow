"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, Badge } from "@/components/ui";
import MenuModal from "./MenuModal";
import { formatPrice } from "@/utils/format";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  allergens?: string[];
  category_id: string | null;
}

interface MenuListProps {
  groupedItems: any[];
}

export default function MenuList({ groupedItems }: MenuListProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  return (
    <div className="px-4 space-y-10">
      {groupedItems.map((category) => (
        <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-32">
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-lg font-bold text-on-surface tracking-tight">{category.name}</h3>
            <Badge variant="outline" className="border-outline-variant/30 text-[10px] text-on-surface-variant">
              {category.items.length}
            </Badge>
            <div className="h-[1px] flex-1 bg-outline-variant/20" />
          </div>
          
          <div className="grid gap-3">
            {category.items.map((item: MenuItem) => (
              <Card 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="flex p-0 overflow-hidden border-none bg-surface-container-low active:scale-[0.98] hover:bg-surface-container transition-all group cursor-pointer shadow-sm active:shadow-none"
              >
                {/* Content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-on-surface leading-tight mb-1 group-hover:text-primary transition-colors">
                        {item.name}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-3">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-black text-tertiary">
                          {formatPrice(item.sale_price || item.price)}
                       </span>
                       {item.sale_price && (
                          <span className="text-[10px] text-outline line-through opacity-70">
                              {formatPrice(item.price)}
                          </span>
                       )}
                    </div>
                    
                    {/* Alérgenos (Simplificados en lista) */}
                    {item.allergens && item.allergens.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.allergens.map((allergen: string) => {
                          const config: Record<string, { label: string, color: string }> = {
                            gluten: { label: 'G', color: 'bg-amber-500/10 text-amber-600' },
                            lactosa: { label: 'L', color: 'bg-blue-500/10 text-blue-600' },
                            pescado: { label: 'P', color: 'bg-cyan-500/10 text-cyan-600' },
                            mariscos: { label: 'M', color: 'bg-red-500/10 text-red-600' },
                            vegan: { label: 'V', color: 'bg-emerald-500/10 text-emerald-600' },
                            picante: { label: '🌶️', color: 'bg-orange-500/10 text-orange-600' },
                            frutos_secos: { label: 'FS', color: 'bg-brown-500/10 text-brown-600' }
                          };
                          const c = config[allergen.toLowerCase()] || { label: allergen[0].toUpperCase(), color: 'bg-outline/10 text-outline' };
                          return (
                            <span 
                              key={allergen} 
                              className={`text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full ${c.color} border border-current/10`}
                            >
                              {c.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Section */}
                {item.image_url && (
                  <div className="relative w-28 h-28 shrink-0">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.sale_price && (
                        <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                    )}
                    {item.sale_price && (
                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                             <div className="bg-[#FFB930] text-black font-black px-2 py-0.5 rounded-full text-[9px] border border-white/40 shadow-[0_2px_10px_rgba(0,0,0,0.5)] leading-none">
                               OFERTA
                             </div>
                        </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      ))}

      <MenuModal 
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
