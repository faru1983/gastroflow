"use client";

import { Bell, Menu, User, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";

interface HeaderProps {
  restaurantName: string;
}

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function Header({ restaurantName }: HeaderProps) {
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
    <header className="h-16 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={handleSignOut}>
            <LogOut size={20} />
        </Button>
        <div>
            <h2 className="text-sm md:text-base font-bold text-on-surface truncate max-w-[150px] md:max-w-none">
              {restaurantName}
            </h2>
            <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm" className="bg-primary/10 text-primary border-none">Plan Trial</Badge>
                <span className="text-[10px] text-outline hidden md:block">Finaliza en 28 días</span>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} className="text-on-surface-variant" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full border-2 border-surface" />
        </Button>
        <div className="h-8 w-[1px] bg-outline-variant/30 mx-2 hidden md:block" />
        <Button 
            variant="ghost" 
            className="hidden md:flex items-center gap-2 px-2 hover:bg-surface-container-high"
            onClick={handleSignOut}
        >
            <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-error">
                <LogOut size={14} />
            </div>
            <span className="text-sm font-medium text-error">Cerrar Sesión</span>
        </Button>
      </div>
    </header>
  );
}
