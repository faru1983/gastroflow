"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import type { Reservation } from '@/lib/types';
import { formatDateInput } from '@/lib/utils';
import { LoggedOutCard } from '@/components/LoggedOutCard';
import { usePagination } from '@/hooks/use-pagination';
import { PaginationControls } from '@/components/PaginationControls';

function LoggedInView() {
    const { user, logout, updateUser, visits, reservations, updateReservation } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const { toast } = useToast();
    
    const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);

    // Pagination
    const sortedReservations = [...reservations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const { paginatedData: paginatedReservations, ...reservationsPagination } = usePagination(sortedReservations, 5);
    const { paginatedData: paginatedVisits, ...visitsPagination } = usePagination(visits, 5);
    

    const handleConfirmReservation = (id: string) => {
        updateReservation(id, 'confirmada');
        toast({
            title: "¡Reserva Confirmada!",
            description: "Tu reserva ha sido confirmada correctamente.",
            className: 'bg-green-600 text-primary-foreground'
        });
    };

    const handleCancelReservation = () => {
        if (reservationToCancel) {
            updateReservation(reservationToCancel.id, 'cancelada');
            toast({
                variant: "destructive",
                title: "Reserva Cancelada",
                description: "Tu reserva ha sido cancelada."
            });
            setReservationToCancel(null);
        }
    };

    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        apellidos: user?.apellidos || '',
        email: user?.email || '',
        celular: user?.celular || '',
        fechaNacimiento: user?.fechaNacimiento ? user.fechaNacimiento.split('-').reverse().join('-') : '',
        comuna: user?.comuna || '',
        instagram: user?.instagram || '',
        promociones: user?.promociones ?? true,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    useEffect(() => {
        if(user && !isEditing) {
            setFormData({
                nombre: user.nombre || '',
                apellidos: user.apellidos || '',
                email: user.email || '',
                celular: user.celular || '',
                fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.split('-').reverse().join('-') : '',
                comuna: user.comuna || '',
                instagram: user.instagram || '',
                promociones: user.promociones,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
        }
    }, [user, isEditing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        const { currentPassword, newPassword, confirmNewPassword, fechaNacimiento, ...rest } = formData;
        
        if (newPassword || currentPassword) {
            if (newPassword !== confirmNewPassword) {
                toast({ variant: "destructive", title: "Error", description: "Las nuevas contraseñas no coinciden." });
                return;
            }
            if (newPassword && !currentPassword) {
                toast({ variant: "destructive", title: "Error", description: "Debes ingresar tu contraseña actual para cambiarla." });
                return;
            }
        }
        
        if (fechaNacimiento) {
             if (!/^\d{2}-\d{2}-\d{4}$/.test(fechaNacimiento)) {
                toast({ variant: "destructive", title: "Error", description: "Formato de fecha no válido. Usa DD-MM-YYYY." });
                return;
            }
            const [day, month, year] = fechaNacimiento.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            if (!(date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day)) {
                toast({ variant: "destructive", title: "Error", description: "Fecha de nacimiento no es válida." });
                return;
            }
        }
        
        const formattedFechaNacimiento = fechaNacimiento ? fechaNacimiento.split('-').reverse().join('-') : undefined;
        updateUser({ ...rest, fechaNacimiento: formattedFechaNacimiento, comuna: formData.comuna || '' });
        setIsEditing(false);
        toast({ title: "¡Éxito!", description: "Tu información ha sido actualizada correctamente." });
    }

    if (!user) return null;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-headline">Mi Perfil</h1>
                 <Button variant="link" onClick={logout}>Cerrar Sesión</Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Mis Datos</CardTitle>
                    <CardDescription>Aquí puedes ver y actualizar tu información personal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} disabled={!isEditing} />
                        <Input name="apellidos" placeholder="Apellidos" value={formData.apellidos} onChange={handleInputChange} disabled={!isEditing} />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} disabled={true} />
                        <Input
                          name="celular"
                          placeholder="Celular"
                          value={formData.celular}
                          onFocus={(e) => {
                            if (e.target.value === '') {
                              setFormData({ ...formData, celular: '+569-' });
                            }
                          }}
                          onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                          disabled={!isEditing}
                        />
                    </div>
                    
                    <div className="text-sm font-medium text-muted-foreground pt-2">Datos Opcionales:</div>

                    <Input name="fechaNacimiento" placeholder="Fecha de Nacimiento (DD-MM-YYYY)" value={formData.fechaNacimiento} onChange={(e) => setFormData({...formData, fechaNacimiento: formatDateInput(e.target.value)})} disabled={!isEditing} />
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input name="comuna" placeholder="Comuna" value={formData.comuna} onChange={handleInputChange} disabled={!isEditing} />
                        <Input name="instagram" placeholder="@instagram" value={formData.instagram} onChange={handleInputChange} disabled={!isEditing} />
                    </div>

                    {isEditing && (
                        <>
                            <Separator />
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold -mb-2">Cambiar Contraseña</h3>
                                <Input name="currentPassword" type="password" placeholder="Contraseña Actual" value={formData.currentPassword} onChange={handleInputChange} />
                                <Input name="newPassword" type="password" placeholder="Nueva Contraseña" value={formData.newPassword} onChange={handleInputChange} />
                                <Input name="confirmNewPassword" type="password" placeholder="Confirmar Nueva Contraseña" value={formData.confirmNewPassword} onChange={handleInputChange} />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold -mb-2">Preferencias</h3>
                                <div className="flex items-center space-x-2">
                                    <Switch id="promociones" checked={formData.promociones} onCheckedChange={(checked) => setFormData({...formData, promociones: checked})} />
                                    <Label htmlFor="promociones">Suscribirse a mensajes promocionales</Label>
                                </div>
                            </div>
                            
                            <Separator/>
                        </>
                    )}
                </CardContent>
                 <CardFooter className="flex-col items-start gap-4">
                     {isEditing ? (
                        <div className="flex gap-2">
                            <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 text-primary-foreground">Guardar Cambios</Button>
                            <Button variant="ghost" onClick={() => { setIsEditing(false); setDeleteConfirmText(""); }}>Cancelar</Button>
                        </div>
                    ) : (
                        <Button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700 text-primary-foreground">Actualizar Datos</Button>
                    )}
                    
                    {isEditing && (
                         <div className="space-y-4 pt-4 w-full border-t mt-4">
                             <h3 className="text-lg font-semibold text-destructive">Zona de Peligro</h3>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">Eliminar Cuenta</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Para confirmar, escribe "Eliminar" en el campo de abajo.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder='Eliminar'/>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction disabled={deleteConfirmText !== 'Eliminar'} onClick={logout}>Confirmar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <p className="text-sm text-muted-foreground">Esta acción es permanente y eliminará todos tus datos, visitas y beneficios asociados.</p>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <Tabs defaultValue="reservations" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="reservations">Mis Reservas</TabsTrigger>
                    <TabsTrigger value="visits">Mis Visitas</TabsTrigger>
                </TabsList>
                <TabsContent value="reservations">
                    <Card>
                        <CardContent className="p-0">
                           <ul className="divide-y">
                                {paginatedReservations.map(res => {
                                    const isPast = new Date(res.date) < new Date(new Date().setHours(0, 0, 0, 0));
                                    
                                    return (
                                        <li key={res.id} className="p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                            <div>
                                                <p className="font-semibold">{res.people} personas, {res.preference}</p>
                                                <p className="text-sm text-muted-foreground">{new Date(res.date).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} a las {res.time}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {res.status === 'pendiente' && !isPast && (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => handleConfirmReservation(res.id)} className="bg-green-600 hover:bg-green-700 text-primary-foreground">Confirmar</Button>
                                                        <Button variant="destructive" size="sm" onClick={() => setReservationToCancel(res)}>Cancelar</Button>
                                                    </div>
                                                )}
                                                {res.status === 'confirmada' && (
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="border-transparent bg-green-600 text-primary-foreground hover:bg-green-600/80">Confirmada</Badge>
                                                        {!isPast && <Button variant="destructive" size="sm" onClick={() => setReservationToCancel(res)}>Cancelar</Button>}
                                                    </div>
                                                )}
                                                {res.status === 'cancelada' && <Badge variant="destructive">Cancelada</Badge>}
                                                {res.status === 'pendiente' && isPast && (
                                                    <Badge className="border-transparent bg-yellow-400 text-yellow-950 hover:bg-yellow-400/80">Finalizada</Badge>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </CardContent>
                        {reservations.length > 5 && (
                            <CardFooter className="pt-4 justify-center">
                                <PaginationControls {...reservationsPagination} />
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>
                <TabsContent value="visits">
                    <Card>
                        <CardContent className="p-0">
                             <ul className="divide-y">
                                {paginatedVisits.map(visit => (
                                    <li key={visit.id} className="p-4">
                                        <p className="font-semibold">{visit.reason}</p>
                                        <p className="text-sm text-muted-foreground">{visit.date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })} - {visit.date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                         {visits.length > 5 && (
                            <CardFooter className="pt-4 justify-center">
                                <PaginationControls {...visitsPagination} />
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>

            <AlertDialog open={!!reservationToCancel} onOpenChange={() => setReservationToCancel(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de que quieres cancelar?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Tu reserva será marcada como cancelada.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Volver</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelReservation} className={buttonVariants({ variant: "destructive" })}>
                            Confirmar Cancelación
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function ProfilePage() {
    const { isAuthenticated } = useAuth();
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {isAuthenticated ? <LoggedInView /> : <LoggedOutCard 
                title="Mi Perfil"
                description="Inicia sesión o crea una cuenta para gestionar tus reservas, ver tu historial de visitas y acceder a beneficios exclusivos."
            />}
        </div>
    );
}
