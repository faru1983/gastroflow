"use client";

import { useState } from "react";
import { Card, Button, Input, Badge } from "@/components/ui";
import { Gift, Zap, Cake, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export function RewardConfig({ restaurant }: { restaurant: any }) {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    loyalty_welcome_reward_enabled: restaurant.loyalty_welcome_reward_enabled,
    loyalty_welcome_reward_text: restaurant.loyalty_welcome_reward_text || "",
    loyalty_stamps_reward_enabled: restaurant.loyalty_stamps_reward_enabled,
    loyalty_stamps_reward_text: restaurant.loyalty_stamps_reward_text || "",
    loyalty_stamps_target: restaurant.loyalty_stamps_target || 10,
    loyalty_birthday_reward_enabled: restaurant.loyalty_birthday_reward_enabled,
    loyalty_birthday_reward_text: restaurant.loyalty_birthday_reward_text || ""
  });

  const supabase = createClient();

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("restaurants")
        .update(config)
        .eq("id", restaurant.id);

      if (error) throw error;
      toast.success("Configuración guardada exitosamente");
    } catch (error: any) {
      toast.error("Error al guardar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Welcome Reward */}
        <Card className="p-6 border-none bg-surface-container-low">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3 items-center">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Premio de Bienvenida</h4>
                <p className="text-xs text-on-surface-variant">Se otorga al registrarse por primera vez</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={config.loyalty_welcome_reward_enabled}
              onChange={(e) => setConfig({...config, loyalty_welcome_reward_enabled: e.target.checked})}
              className="toggle-primary" // Asumo clase de estilizado o checkbox estándar
            />
          </div>
          
          <div className="space-y-1.5 opacity-100 transition-opacity">
            <label className="text-xs font-bold text-primary uppercase tracking-wider ml-1">Regalo a otorgar</label>
            <Input 
              placeholder="Ej: Un pisco sour de cortesía"
              value={config.loyalty_welcome_reward_text}
              disabled={!config.loyalty_welcome_reward_enabled}
              onChange={(e) => setConfig({...config, loyalty_welcome_reward_text: e.target.value})}
              className="bg-surface-container-high border-none h-11"
            />
          </div>
        </Card>

        {/* Stamps Reward */}
        <Card className="p-6 border-none bg-surface-container-low">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3 items-center">
              <div className="p-2 rounded-lg bg-tertiary/10 text-tertiary">
                <Gift size={20} />
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Sistema de Sellos</h4>
                <p className="text-xs text-on-surface-variant">Premio por recurrencia automática</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={config.loyalty_stamps_reward_enabled}
              onChange={(e) => setConfig({...config, loyalty_stamps_reward_enabled: e.target.checked})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="md:col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-primary uppercase tracking-wider ml-1">Meta de Sellos</label>
                <Input 
                  type="number"
                  placeholder="10"
                  value={config.loyalty_stamps_target}
                  disabled={!config.loyalty_stamps_reward_enabled}
                  onChange={(e) => setConfig({...config, loyalty_stamps_target: parseInt(e.target.value)})}
                  className="bg-surface-container-high border-none h-11 text-center font-bold"
                />
             </div>
             <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-primary uppercase tracking-wider ml-1">Premio al completar</label>
                <Input 
                  placeholder="Ej: Plato de fondo a elección"
                  value={config.loyalty_stamps_reward_text}
                  disabled={!config.loyalty_stamps_reward_enabled}
                  onChange={(e) => setConfig({...config, loyalty_stamps_reward_text: e.target.value})}
                  className="bg-surface-container-high border-none h-11"
                />
             </div>
          </div>
        </Card>

        {/* Birthday Reward */}
        <Card className="p-6 border-none bg-surface-container-low">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3 items-center">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Cake size={20} />
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Socio de Cumpleaños</h4>
                <p className="text-xs text-on-surface-variant">Regalo automático en su mes o día</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={config.loyalty_birthday_reward_enabled}
              onChange={(e) => setConfig({...config, loyalty_birthday_reward_enabled: e.target.checked})}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-primary uppercase tracking-wider ml-1">Regalo de Cumpleaños</label>
            <Input 
              placeholder="Ej: Un postre para compartir"
              value={config.loyalty_birthday_reward_text}
              disabled={!config.loyalty_birthday_reward_enabled}
              onChange={(e) => setConfig({...config, loyalty_birthday_reward_text: e.target.value})}
              className="bg-surface-container-high border-none h-11"
            />
          </div>
        </Card>
      </div>

      <div className="space-y-6">
         <Card className="p-8 border-none bg-linear-to-br from-primary/10 to-transparent rounded-[32px] border border-primary/20 sticky top-8">
            <h3 className="text-xl font-bold text-on-surface mb-4">Estrategia de Fidelización</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
                Al activar estos premios, los clientes recibirán notificaciones en su perfil digital. El sistema de sellos es el motor más potente para aumentar el ticket promedio: ¡Úsalo para premiar visitas frecuentes!
            </p>
            
            <ul className="space-y-4 mb-10 text-sm">
                <li className="flex items-center gap-3 text-on-surface">
                   <Check size={18} className="text-primary" strokeWidth={3} />
                   Aumenta la retención un 35%
                </li>
                <li className="flex items-center gap-3 text-on-surface">
                   <Check size={18} className="text-primary" strokeWidth={3} />
                   Incentiva el registro de datos (teléfono, correo)
                </li>
                <li className="flex items-center gap-3 text-on-surface">
                   <Check size={18} className="text-primary" strokeWidth={3} />
                   Crea sentido de pertenencia al club
                </li>
            </ul>

            <Button 
              onClick={handleSave} 
              disabled={loading}
              fullWidth 
              size="lg" 
              className="h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20"
            >
              {loading ? "Guardando..." : "Guardar Configuración"}
              {!loading && <Save size={20} className="ml-2" />}
            </Button>
         </Card>
      </div>
    </div>
  );
}
