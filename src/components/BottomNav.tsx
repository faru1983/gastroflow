"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpenText, Heart, CalendarClock, CircleUserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/menu', label: 'Carta', icon: BookOpenText },
  { href: '/reservations', label: 'Reservas', icon: CalendarClock },
  { href: '/loyalty', label: 'Fidelización', icon: Heart },
  { href: '/profile', label: 'Mi Perfil', icon: CircleUserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-background/80 backdrop-blur-sm border-t">
      <div className="flex justify-around items-center h-full max-w-4xl mx-auto">
        {navItems.map((item) => {
          const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className="group flex flex-col items-center justify-center flex-1 h-full rounded-md transition-transform duration-200 ease-out hover:scale-105 focus-visible:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <item.icon
                  className={cn(
                    'h-6 w-6 mb-1 transition-all duration-200 ease-out',
                    isActive ? 'text-primary scale-110 -translate-y-1' : 'text-muted-foreground group-hover:text-primary'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                  )}
                >
                  {item.label}
                </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
