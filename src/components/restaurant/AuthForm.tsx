"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, Card, Input } from "@/components/ui";
import { LogIn, UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  restaurantName: string;
  restaurantId: string;
}

export default function AuthForm({ restaurantName, restaurantId }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'client',
              restaurant_id: restaurantId
            }
          }
        });
        if (error) throw error;
        toast.success("¡Registro exitoso! Revisa tu email para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("¡Bienvenido de nuevo!");
        router.refresh(); // Actualiza el estado del servidor
      }
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="p-6 border-none bg-surface-container-low rounded-[24px] shadow-sm">
        <form onSubmit={handleAuth} className="space-y-4">
          <Input 
            label="Email" 
            type="email"
            placeholder="tu@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={16} />} 
            required
            disabled={loading}
          />
          <Input 
            label="Contraseña" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={16} />} 
            required
            disabled={loading}
          />
          
          <div className="pt-2">
            <Button 
              type="submit"
              fullWidth 
              size="lg" 
              className="rounded-[12px] font-bold h-12 shadow-md shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin mr-2" />
              ) : (
                isRegistering ? <UserPlus size={18} className="mr-2" /> : <LogIn size={18} className="mr-2" />
              )}
              {isRegistering ? "Crear Cuenta" : "Ingresar"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-on-surface-variant mb-4">
          {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes cuenta?"}
        </p>
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-primary font-bold hover:underline"
          disabled={loading}
        >
          {isRegistering ? "Inicia Sesión aquí" : "Registrarme en el Club"}
        </button>
      </div>
    </div>
  );
}
