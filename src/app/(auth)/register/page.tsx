"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";
import { UtensilsCrossed, Mail, Lock, Eye, EyeOff, Store } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z.object({
  restaurantName: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export default function RegisterPage() {
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = registerSchema.safeParse({ restaurantName, email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const supabase = createClient();

    // Generate slug from restaurant name
    const slug = restaurantName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          restaurant_name: restaurantName,
        },
      },
    });

    if (authError) {
      toast.error(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      toast.error("Error al crear la cuenta");
      setLoading(false);
      return;
    }

    // 2. Create restaurant (tenant)
    const { data: restaurant, error: restError } = await supabase
      .from("restaurants")
      .insert({
        name: restaurantName,
        slug,
        owner_id: authData.user.id,
        subscription_status: "trial",
      })
      .select("id")
      .single();

    if (restError) {
      toast.error("Error al crear el restaurante: " + restError.message);
      setLoading(false);
      return;
    }

    // 3. Update user metadata with restaurant_id
    await supabase.auth.updateUser({
      data: {
        restaurant_id: restaurant.id,
        restaurant_name: restaurantName,
        restaurant_slug: slug,
      },
    });

    toast.success("¡Cuenta creada! Bienvenido a Gastroflow 🎉");
    router.push("/dashboard");
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
          Crear cuenta
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Prueba gratis por 30 días
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-3">
        <div className="relative">
          <Input
            label="Nombre del restaurante"
            placeholder="Ej: Gastro Bistro"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            error={errors.restaurantName}
          />
          <Store
            size={16}
            strokeWidth={1.5}
            className="absolute right-3 top-[34px] text-outline"
          />
        </div>

        <div className="relative">
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            error={errors.email}
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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            error={errors.password}
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
          Crear cuenta gratis
        </Button>
      </form>

      {/* Slug preview */}
      {restaurantName && (
        <div className="mt-3 px-3 py-2 bg-surface-container-low rounded-[8px]">
          <p className="text-[11px] text-on-surface-variant">
            Tu URL será:{" "}
            <span className="text-primary font-medium">
              gastroflow.cl/
              {restaurantName
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")}
            </span>
          </p>
        </div>
      )}

      {/* Links */}
      <div className="mt-4 text-center">
        <Link
          href="/login"
          className="text-sm text-primary hover:underline"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </div>
    </div>
  );
}
