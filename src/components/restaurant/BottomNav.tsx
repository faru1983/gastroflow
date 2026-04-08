"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  UtensilsCrossed, 
  CalendarDays, 
  Heart, 
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface BottomNavProps {
  slug: string;
}

export default function BottomNav({ slug }: BottomNavProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const navItems = [
    { label: "Inicio", icon: Home, href: `/${slug}` },
    { label: "Carta", icon: UtensilsCrossed, href: `/${slug}/carta` },
    { label: "Reserva", icon: CalendarDays, href: `/${slug}/reserva` },
    { label: "Club", icon: Heart, href: `/${slug}/fidelidad` },
    { label: "Perfil", icon: User, href: `/${slug}/perfil` },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4 pointer-events-none">
      <div className="flex items-center gap-2 max-w-md w-full pointer-events-auto">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-12 w-10 flex items-center justify-center bg-surface-bright/80 backdrop-blur-xl border border-white/10 rounded-[16px] shadow-lg text-primary active:scale-95 transition-all"
          aria-label={isExpanded ? "Ocultar menú" : "Mostrar menú"}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Navigation Bar */}
        <nav 
          className={`flex items-center justify-between flex-1 bg-surface-bright/70 backdrop-blur-[24px] border border-white/10 h-16 rounded-[24px] px-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 origin-left ${
            isExpanded 
              ? "opacity-100 scale-100 translate-x-0" 
              : "opacity-0 scale-90 -translate-x-full pointer-events-none"
          }`}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Icon size={18} className={isActive ? "scale-110" : ""} />
                <span className={`text-[9px] font-bold ${isActive ? "opacity-100" : "opacity-60"}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-2.5 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
