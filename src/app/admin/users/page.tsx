import { Card } from "@/components/ui";
import { Users, ShieldCheck, Mail, Search } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Usuarios Globales</h1>
        <p className="text-on-surface-variant flex items-center gap-2">
          <Users size={16} />
          Gestión de todos los usuarios registrados en el ecosistema.
        </p>
      </div>

      <Card className="p-12 border-none bg-surface-container-low flex flex-col items-center justify-center text-center">
         <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <ShieldCheck size={32} />
         </div>
         <h2 className="text-xl font-bold text-on-surface mb-2">Módulo en Desarrollo</h2>
         <p className="text-sm text-on-surface-variant max-w-sm">
            Aquí podrás administrar los permisos de SuperAdmins y ver las métricas de registro global de cada local.
         </p>
      </Card>
    </div>
  );
}
