"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  UtensilsCrossed, 
  CalendarDays, 
  Users, 
  Settings, 
  LogOut,
  LayoutDashboard,
  QrCode,
  Heart,
  ScanLine
} from "lucide-react";
import { Button } from "@/components/ui";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/menu", label: "Carta Digital", icon: UtensilsCrossed },
  { href: "/dashboard/qr", label: "Código QR", icon: QrCode },
  { href: "/dashboard/reservations", label: "Reservas", icon: CalendarDays },
  { href: "/dashboard/customers", label: "Clientes", icon: Users },
  { href: "/dashboard/loyalty", label: "Fidelización", icon: Heart },
  { href: "/dashboard/loyalty/scanner", label: "Registrar Visita", icon: ScanLine },
  { href: "/dashboard/analytics", label: "Analítica", icon: BarChart3 },
];

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
    } else {
      router.push("/login");
      router.refresh();
      toast.success("Sesión cerrada correctamente");
    }
  };

  return (
    <aside className="w-64 bg-surface-container border-r border-outline-variant flex flex-col h-screen fixed left-0 top-0 z-30 hidden md:flex">
      {/* Brand */}
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-[6px] gradient-primary flex items-center justify-center">
          <UtensilsCrossed size={16} className="text-on-primary-container" />
        </div>
        <span className="text-lg font-bold tracking-tight text-on-surface">Gastroflow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-outline-variant space-y-1">
        <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
        >
            <Settings size={18} />
            Configuracion
        </Link>
        <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm font-medium text-error hover:bg-error/10 transition-colors"
            onClick={handleSignOut}
        >
            <LogOut size={18} />
            Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
