"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockReservations, mockVisits } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

function LoggedOutView() {
    const { showAuthModal } = useAuth();
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Mi Perfil</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-lg">
                    Inicia sesión o crea una cuenta para gestionar tus reservas, ver tu historial de visitas y acceder a beneficios exclusivos.
                </p>
            </CardContent>
            <CardFooter>
                <Button onClick={() => showAuthModal()} className="w-full">
                    Iniciar Sesión / Registrarse
                </Button>
            </CardFooter>
        </Card>
    );
}

function LoggedInView() {
    const { user, logout, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const { toast } = useToast();
    
    // Local state for form fields to not affect context until save
    const [formData, setFormData] = useState({
        ...user,
        nombre: user?.nombre || '',
        apellidos: user?.apellidos || '',
        fechaNacimiento: user?.fechaNacimiento || '',
        comuna: user?.comuna || '',
        instagram: user?.instagram || '',
        celular: user?.celular || '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData!, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        if (formData) {
            updateUser(formData);
        }
        setIsEditing(false);
        toast({ title: "Datos actualizados", description: "Tu información ha sido guardada." });
    }

    if (!user || !formData) return null;

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
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><Label>Nombre</Label><Input name="nombre" value={formData.nombre || ''} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div><Label>Apellidos</Label><Input name="apellidos" value={formData.apellidos || ''} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div><Label>Fecha de Nacimiento</Label><Input name="fechaNacimiento" type="date" value={formData.fechaNacimiento || ''} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div><Label>Comuna</Label><Input name="comuna" value={formData.comuna || ''} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div><Label>Instagram</Label><Input name="instagram" value={formData.instagram || ''} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div><Label>Email</Label><Input name="email" type="email" value={formData.email || ''} onChange={handleInputChange} disabled={!isEditing} /></div>
                        <div><Label>Celular</Label><Input name="celular" value={formData.celular || ''} onChange={handleInputChange} disabled={!isEditing} /></div>
                    </div>
                     {isEditing && (
                        <>
                            <Separator className="my-6"/>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Switch id="promociones" checked={formData.promociones} onCheckedChange={(checked) => setFormData({...formData, promociones: checked})} />
                                    <Label htmlFor="promociones">Suscribirse a mensajes promocionales</Label>
                                </div>
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
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter>
                    {isEditing ? (
                        <div className="flex gap-2">
                            <Button onClick={handleUpdate}>Guardar Cambios</Button>
                            <Button variant="ghost" onClick={() => { setIsEditing(false); setFormData({...user, nombre: user?.nombre || ''});}}>Cancelar</Button>
                        </div>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>Actualizar Datos</Button>
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
                                {mockReservations.map(res => (
                                    <li key={res.id} className="p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                        <div>
                                            <p className="font-semibold">{res.people} personas, {res.preference}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(res.date).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} a las {res.time}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={res.status === 'confirmada' ? 'default' : res.status === 'cancelada' ? 'destructive' : 'secondary'} className="capitalize">{res.status}</Badge>
                                            {res.status === 'confirmada' && <div className="flex gap-2"><Button variant="outline" size="sm">Editar</Button><Button variant="destructive" size="sm">Cancelar</Button></div>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="visits">
                    <Card>
                        <CardContent className="p-0">
                             <ul className="divide-y">
                                {mockVisits.map(visit => (
                                    <li key={visit.id} className="p-4">
                                        <p className="font-semibold">{visit.reason}</p>
                                        <p className="text-sm text-muted-foreground">{visit.date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })} - {visit.date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function ProfilePage() {
    const { isAuthenticated } = useAuth();
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {isAuthenticated ? <LoggedInView /> : <LoggedOutView />}
        </div>
    );
}
