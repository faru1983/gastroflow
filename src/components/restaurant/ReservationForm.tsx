"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card, Badge } from "@/components/ui";
import { getAvailableSlots, createReservation } from "@/services/reservation";
import { toast } from "sonner";
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Info 
} from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

interface ReservationFormProps {
  restaurantId: string;
  restaurantName: string;
  slug: string;
}

export default function ReservationForm({ restaurantId, restaurantName, slug }: ReservationFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form State
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("");
  const [slotId, setSlotId] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const nextDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  useEffect(() => {
    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const data = await getAvailableSlots(restaurantId, date);
        setSlots(data);
        if (data.length > 0 && !data.find(s => s.time === time)) {
            setTime("");
            setSlotId("");
        }
      } catch (err) {
        toast.error("Error al cargar horarios");
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, [date, restaurantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createReservation({
        restaurant_id: restaurantId,
        slot_id: slotId,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        date,
        time,
        party_size: partySize,
        notes
      });
      setStep(3); // Success step
      toast.success("¡Reserva solicitada con éxito!");
    } catch (err: any) {
      toast.error(err.message || "Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold mb-2">¡Reserva Recibida!</h2>
        <p className="text-on-surface-variant text-sm mb-8">
          Hemos recibido tu solicitud para el <strong>{format(new Date(date), "PPP", { locale: es })}</strong> a las <strong>{time.slice(0, 5)}</strong>. Te contactaremos pronto para confirmar.
        </p>
        <Button asChild fullWidth variant="outline">
          <a href={`/${slug}`}>Volver al Inicio</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Date Selector */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-outline uppercase tracking-wider mb-3 block">
          1. Selecciona el Día
        </label>
        <div className="flex gap-2 overflow-x-auto scroll-smooth -mx-4 px-4 pb-2">
          {nextDays.map((d) => {
            const dateStr = format(d, "yyyy-MM-dd");
            const isSelected = date === dateStr;
            return (
              <button
                key={dateStr}
                onClick={() => setDate(dateStr)}
                className={`flex flex-col items-center justify-center min-w-[64px] h-20 rounded-[12px] border transition-all ${
                  isSelected 
                    ? "bg-primary text-on-primary-container border-primary" 
                    : "bg-surface-container-low text-on-surface-variant border-transparent"
                }`}
              >
                <span className="text-[10px] uppercase font-bold opacity-70">
                  {format(d, "EEE", { locale: es })}
                </span>
                <span className="text-lg font-bold">
                  {format(d, "d")}
                </span>
                <span className="text-[10px] uppercase font-bold opacity-70">
                  {format(d, "MMM", { locale: es })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slots Selector */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-outline uppercase tracking-wider mb-3 block">
          2. Elige un Horario
        </label>
        {loadingSlots ? (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-10 rounded-[8px] bg-surface-container-high animate-pulse" />)}
          </div>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s) => (
              <button
                key={s.id}
                disabled={!s.is_available}
                onClick={() => {
                  setTime(s.time);
                  setSlotId(s.id);
                }}
                className={`h-11 rounded-[8px] border text-sm font-medium transition-all flex items-center justify-center ${
                  time === s.time
                    ? "bg-tertiary text-on-primary-container border-tertiary shadow-lg shadow-tertiary/20"
                    : s.is_available 
                      ? "bg-surface-container-high text-on-surface border-transparent"
                      : "bg-surface-container-low text-outline border-transparent opacity-50 cursor-not-allowed"
                }`}
              >
                {s.time.slice(0, 5)}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-low p-4 rounded-[12px] text-center">
            <p className="text-xs text-on-surface-variant italic">No hay horarios configurados para este día.</p>
          </div>
        )}
      </div>

      {/* Party Size Selector */}
      <div className="mb-8">
        <label className="text-xs font-semibold text-outline uppercase tracking-wider mb-3 block">
          3. ¿Cuántas personas?
        </label>
        <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-[12px]">
           {[1, 2, 3, 4, 5, 6, 8].map(num => (
             <button
                key={num}
                onClick={() => setPartySize(num)}
                className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                    partySize === num ? "bg-primary text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
             >
                {num}
             </button>
           ))}
        </div>
      </div>

      {/* Contact Info (Step 2) */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tu Nombre"
          placeholder="Ej: Juan Pérez"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email"
              type="email"
              placeholder="juan@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Teléfono"
              placeholder="+56 9..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
        </div>
        <Input
          label="Notas opcionales"
          placeholder="Alergias, celebración..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="pt-4">
            <Button 
                type="submit" 
                fullWidth 
                size="lg" 
                loading={loading}
                disabled={!time || !date || !name || !email}
                className="h-14 text-base font-bold rounded-[12px]"
            >
                Confirmar Reserva
            </Button>
            <p className="text-[10px] text-center text-outline mt-3 flex items-center justify-center gap-1">
                <Info size={10} /> La reserva está sujeta a confirmación por el local.
            </p>
        </div>
      </form>
    </div>
  );
}
