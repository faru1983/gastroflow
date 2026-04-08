"use client";

import Image from "next/image";
import { Info, AlertTriangle, X } from "lucide-react";
import { Modal, Badge } from "@/components/ui";
import { formatPrice } from "@/utils/format";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  allergens?: string[];
}

interface MenuModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ALLERGEN_MAP: Record<string, { label: string, icon: string, color: string }> = {
  gluten: { label: 'Gluten', icon: '🍞', color: 'bg-amber-500/10 text-amber-700 border-amber-500/20' },
  lactosa: { label: 'Lactosa', icon: '🥛', color: 'bg-blue-500/10 text-blue-700 border-blue-500/20' },
  pescado: { label: 'Pescado', icon: '🐟', color: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20' },
  mariscos: { label: 'Mariscos', icon: '🦐', color: 'bg-red-500/10 text-red-700 border-red-500/20' },
  vegan: { label: 'Vegano', icon: '🌱', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' },
  picante: { label: 'Picante', icon: '🌶️', color: 'bg-orange-500/10 text-orange-700 border-orange-500/20' },
  frutos_secos: { label: 'Frutos Secos', icon: '🥜', color: 'bg-stone-500/10 text-stone-700 border-stone-500/20' }
};

export default function MenuModal({ item, isOpen, onClose }: MenuModalProps) {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="relative overflow-hidden no-scrollbar">
        {/* Close Button Floating */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-50 w-9 h-9 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center text-white hover:bg-black/50 transition-all border border-white/20 shadow-xl"
        >
          <X size={20} />
        </button>

        {/* Hero Image */}
        <div className="relative h-60 w-full overflow-hidden rounded-t-[28px]">
          {item.image_url ? (
            <Image 
              src={item.image_url} 
              alt={item.name} 
              fill 
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full gradient-primary opacity-20 flex items-center justify-center">
               <Info size={48} className="text-primary opacity-20" />
            </div>
          )}
          {item.sale_price && (
            <div className="absolute top-4 left-4">
                <div className="bg-[#FFB930] text-black font-black px-3 py-1.5 rounded-full text-[11px] border-2 border-white shadow-[0_4px_20px_rgba(0,0,0,0.6)] animate-bounce-subtle">
                   ¡OFERTA ESPECIAL!
                </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-xl font-bold text-on-surface tracking-tight leading-tight mb-2">
                {item.name}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-tertiary">
                  {formatPrice(item.sale_price || item.price)}
                </span>
                {item.sale_price && (
                  <span className="text-sm text-on-surface-variant line-through opacity-70">
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section tabIndex={0}>
              <h5 className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                <Info size={12} /> Descripción del Plato
              </h5>
              <p className="text-sm text-on-surface-variant leading-relaxed italic">
                {item.description || "Sin descripción disponible."}
              </p>
            </section>

            {item.allergens && item.allergens.length > 0 && (
              <section tabIndex={0}>
                 <h5 className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] mb-4 flex items-center gap-1.5">
                    <AlertTriangle size={12} /> Información de Alérgenos
                 </h5>
                 <div className="grid grid-cols-2 gap-2">
                    {item.allergens.map((alg) => {
                      const a = ALLERGEN_MAP[alg.toLowerCase()] || { label: alg, icon: '🏷️', color: 'bg-surface-container text-on-surface border-outline/20' };
                      return (
                        <div 
                          key={alg} 
                          className={`px-3 py-2 rounded-[12px] border text-[11px] font-bold flex items-center gap-2 ${a.color} shadow-sm`}
                        >
                          <span className="text-sm">{a.icon}</span>
                          <span className="truncate">{a.label}</span>
                        </div>
                      );
                    })}
                 </div>
              </section>
            )}

            <div className="pt-6 border-t border-outline-variant/10">
               <div className="bg-surface-container-low p-3 rounded-[12px] flex items-start gap-3">
                  <Info size={16} className="text-primary shrink-0 mt-0.5" />
                  <p className="text-[10px] text-on-surface-variant leading-normal leading-relaxed">
                    Si tienes alguna restricción alimentaria severa, por favor informa a nuestro personal antes de realizar tu pedido.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
