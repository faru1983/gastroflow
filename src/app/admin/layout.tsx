"use client";

import { useState } from "react";
import { 
  BarChart3, 
  Users, 
  Building2, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/admin", label: "Resumen", icon: LayoutDashboard },
    { href: "/admin/restaurants", label: "Restaurantes", icon: Building2 },
    { href: "/admin/users", label: "Usuarios", icon: Users },
    { href: "/admin/stats", label: "Finanzas", icon: BarChart3 },
  ];

  const NavContent = () => (
    <>
      <nav className="flex-1 px-3 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all ${
                isActive 
                ? "bg-tertiary/10 text-tertiary font-bold shadow-sm" 
                : "text-on-surface-variant hover:bg-surface-container-high font-medium"
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-outline-variant/30">
         <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-bold text-error hover:bg-error/10 transition-colors">
            <LogOut size={20} />
            Cerrar sesión
         </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-surface-container border-r border-outline-variant/30 flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-tertiary flex items-center justify-center shadow-lg shadow-tertiary/20">
            <Settings size={20} className="text-on-tertiary-container" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-on-surface leading-tight">GastroAdmin</span>
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">SaaS Master UI</span>
          </div>
        </div>
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-container/80 backdrop-blur-xl border-b border-outline-variant/30 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[8px] bg-tertiary flex items-center justify-center">
            <Settings size={16} className="text-on-tertiary-container" />
          </div>
          <span className="font-bold text-on-surface">GastroAdmin</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-10 h-10 p-0 rounded-full border-outline-variant/30 bg-surface/50"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-surface/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute top-0 right-0 w-[280px] h-full bg-surface-container shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 flex items-center justify-between border-b border-outline-variant/30">
               <span className="font-bold text-on-surface">Menú Maestro</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant p-2">
                  <X size={20} />
               </button>
            </div>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:max-w-none pt-20 lg:pt-0">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

