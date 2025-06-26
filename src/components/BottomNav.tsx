"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpenText, Heart, CalendarClock, CircleUserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/menu', label: 'Carta', icon: BookOpenText },
  { href: '/loyalty', label: 'Fidelización', icon: Heart },
  { href: '/reservations', label: 'Reservas', icon: CalendarClock },
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
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center flex-1 h-full">
                <item.icon
                  className={cn(
                    'h-6 w-6 mb-1 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
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
