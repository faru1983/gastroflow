import { createClient } from "@/lib/supabase/server";
import { getReservationsByDate } from "@/services/reservation";
import { ReservationsClient } from "@/app/(dashboard)/dashboard/reservations/reservations-client";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export const metadata = {
  title: "Gestión de Reservas | Gastroflow",
  description: "Controla las reservas de tu restaurante en tiempo real.",
};

export default async function ReservationsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const restaurantId = session.user.user_metadata.restaurant_id;

  if (!restaurantId) {
    return (
      <div className="p-8 text-center text-error">
        Usuario sin restaurante asignado.
      </div>
    );
  }

  // Fecha de hoy por defecto para el servidor
  const today = format(new Date(), "yyyy-MM-dd");
  const initialReservations = await getReservationsByDate(restaurantId, today);

  return (
    <ReservationsClient 
      initialReservations={initialReservations} 
      restaurantId={restaurantId}
      initialDate={today}
    />
  );
}
