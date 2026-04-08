"use client";

import { useState, useEffect } from "react";
import { 
  Button, 
  Card, 
  Badge
} from "@/components/ui";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Check, 
  X, 
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail
} from "lucide-react";
import { format, addDays, subDays, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Reservation, updateReservationStatus, getReservationsByDate } from "@/services/reservation";

interface ReservationsClientProps {
  initialReservations: Reservation[];
  restaurantId: string;
  initialDate: string;
}

export function ReservationsClient({ initialReservations, restaurantId, initialDate }: ReservationsClientProps) {
  const [date, setDate] = useState(parseISO(initialDate));
  const [reservations, setReservations] = useState(initialReservations);
  const [isLoading, setIsLoading] = useState(false);

  // Stats calculation
  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed' || r.status === 'completed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    guests: reservations.reduce((acc, curr) => acc + (curr.status !== 'cancelled' ? curr.party_size : 0), 0)
  };

  const loadReservations = async (targetDate: Date) => {
    setIsLoading(true);
    try {
      const dateStr = format(targetDate, "yyyy-MM-dd");
      const data = await getReservationsByDate(restaurantId, dateStr);
      setReservations(data);
    } catch (error) {
      toast.error("Error al cargar reservas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    loadReservations(newDate);
  };

  const handleStatusUpdate = async (id: string, newStatus: any) => {
    try {
      await updateReservationStatus(id, newStatus);
      setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus } : r));
      toast.success(`Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'actualizada'}`);
    } catch (error) {
      toast.error("No se pudo actualizar el estado");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">Gestión de Reservas</h1>
          <p className="text-sm text-on-surface-variant italic">Controla el flujo de tu restaurante en tiempo real.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button size="sm">
                <PlusIcon size={16} className="mr-1" /> Nueva Reserva
            </Button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-surface-container-low p-2 rounded-[12px] border border-outline-variant/10">
        <Button variant="ghost" size="icon" onClick={() => handleDateChange(subDays(date, 1))}>
            <ChevronLeft size={18} />
        </Button>
        <div className="text-center">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">
                {format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? "Hoy" : format(date, "EEEE", { locale: es })}
            </p>
            <p className="text-sm font-semibold text-on-surface">
                {format(date, "d 'de' MMMM, yyyy", { locale: es })}
            </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => handleDateChange(addDays(date, 1))}>
            <ChevronRight size={18} />
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-surface-container-high/50 p-3 rounded-[12px] text-center">
            <p className="text-[9px] text-on-surface-variant font-bold uppercase mb-0.5">Total</p>
            <p className="text-lg font-bold">{stats.total}</p>
        </div>
        <div className="bg-success/5 p-3 rounded-[12px] text-center border border-success/10">
            <p className="text-[9px] text-success font-bold uppercase mb-0.5">Confirmadas</p>
            <p className="text-lg font-bold text-success">{stats.confirmed}</p>
        </div>
        <div className="bg-tertiary/5 p-3 rounded-[12px] text-center border border-tertiary/10">
            <p className="text-[9px] text-tertiary font-bold uppercase mb-0.5">Pendientes</p>
            <p className="text-lg font-bold text-tertiary">{stats.pending}</p>
        </div>
        <div className="bg-primary/5 p-3 rounded-[12px] text-center border border-primary/10">
            <p className="text-[9px] text-primary font-bold uppercase mb-0.5">Cubiertos</p>
            <p className="text-lg font-bold text-primary">{stats.guests}</p>
        </div>
      </div>

      {/* Reservation List */}
      <div className="space-y-3 min-h-[300px]">
        {isLoading ? (
            <div className="py-20 text-center text-on-surface-variant animate-pulse">Cargando reservas...</div>
        ) : (
            <>
                {reservations.length > 0 ? (
                    reservations.map((res) => (
                        <Card key={res.id} className={`p-4 border-none transition-all ${res.status === 'cancelled' ? 'opacity-50 grayscale' : 'bg-surface-container hover:bg-surface-container-high'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-4 min-w-0">
                                    <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-[12px] border border-outline-variant/10 shrink-0 ${res.status === 'confirmed' ? 'bg-success/5' : 'bg-surface-container-low'}`}>
                                        <Clock size={14} className={res.status === 'confirmed' ? 'text-success' : 'text-primary'} />
                                        <span className="text-xs font-bold mt-1">
                                            {res.time.substring(0, 5)}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h4 className="font-bold text-on-surface truncate max-w-[150px]">{res.customer_name}</h4>
                                            <Badge 
                                                variant={
                                                    res.status === "confirmed" ? "success" : 
                                                    res.status === "pending" ? "tertiary" : 
                                                    res.status === "cancelled" ? "secondary" : "outline"
                                                } 
                                                size="sm"
                                                className="text-[9px] h-5"
                                            >
                                                {res.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-on-surface-variant">
                                            <span className="flex items-center gap-1 font-medium"><Users size={12} /> {res.party_size} pax</span>
                                            {res.customer_phone && <span className="flex items-center gap-1"><Phone size={12} /> {res.customer_phone}</span>}
                                            {res.customer_email && <span className="flex items-center gap-1 hidden sm:flex"><Mail size={12} /> {res.customer_email}</span>}
                                        </div>
                                        {res.notes && (
                                            <p className="mt-2 p-2 bg-surface-container-highest/50 rounded-md text-[10px] text-on-surface-variant italic border-l-2 border-outline-variant">
                                                "{res.notes}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {res.status === "pending" && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-9 w-9 text-success bg-success/5 border border-success/10 rounded-full hover:bg-success hover:text-on-primary-container"
                                            onClick={() => handleStatusUpdate(res.id, 'confirmed')}
                                        >
                                            <Check size={18} />
                                        </Button>
                                    )}
                                    {res.status !== "cancelled" && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-9 w-9 text-error bg-error/5 border border-error/10 rounded-full hover:bg-error hover:text-on-primary-container"
                                            onClick={() => handleStatusUpdate(res.id, 'cancelled')}
                                        >
                                            <X size={18} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="py-20 text-center group">
                        <CalendarIcon size={40} className="mx-auto mb-3 text-outline/20 group-hover:scale-110 transition-transform" />
                        <p className="text-sm font-medium text-on-surface-variant">No hay reservas para esta fecha</p>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}

function PlusIcon({ size, className }: { size?: number, className?: string }) {
    return (
        <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
    )
}
