"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";
import { UtensilsCrossed, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Completa todos los campos");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message === "Invalid login credentials"
        ? "Email o contraseña incorrectos"
        : error.message
      );
      setLoading(false);
      return;
    }

    // Lógica de redirección inteligente basada en ROLES
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. ¿Es SuperAdmin del SaaS? (Prioridad Máxima)
    const { data: isSuperAdmin } = await supabase
      .from("super_admins")
      .select("id")
      .eq("user_id", user?.id)
      .single();

    if (isSuperAdmin) {
      toast.success("¡Bienvenido, Administrador Maestro!");
      router.push("/admin");
      router.refresh();
      return;
    }

    // 2. ¿Es Administrador o Garzón de un Restaurante?
    const restaurantId = user?.user_metadata?.restaurant_id;
    if (restaurantId) {
      toast.success("¡Bienvenido al panel del restaurante!");
      router.push("/dashboard");
      router.refresh();
      return;
    }

    // 3. Fallback: Cliente o redirección previa
    toast.success("¡Sesión iniciada!");
    router.push(redirect !== "/dashboard" ? redirect : "/");
    router.refresh();
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-[8px] gradient-primary flex items-center justify-center mb-3">
          <UtensilsCrossed size={24} strokeWidth={1.5} className="text-on-primary-container" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-on-surface">
          Gastroflow
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Inicia sesión en tu cuenta
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-3">
        <div className="relative">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Mail
            size={16}
            strokeWidth={1.5}
            className="absolute right-3 top-[34px] text-outline"
          />
        </div>

        <div className="relative">
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-outline hover:text-on-surface-variant transition-colors"
          >
            {showPassword ? (
              <EyeOff size={16} strokeWidth={1.5} />
            ) : (
              <Eye size={16} strokeWidth={1.5} />
            )}
          </button>
        </div>

        <Button type="submit" fullWidth loading={loading} className="mt-4">
          Iniciar sesión
        </Button>
      </form>

      {/* Links */}
      <div className="mt-4 text-center space-y-2">
        <Link
          href="/register"
          className="text-sm text-primary hover:underline block"
        >
          ¿No tienes cuenta? Regístrate gratis
        </Link>
      </div>
    </div>
  );
}
