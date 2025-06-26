"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { QrCode, Camera, X } from 'lucide-react';
import { mockVisits, activeBenefits, usedBenefits } from '@/lib/data';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function LoggedOutView() {
    const { showAuthModal } = useAuth();
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Programa de Fidelización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-lg">
                    Registra cada visita escaneando el código QR que tiene tu garzón.
                </p>
                <p className="text-2xl font-bold text-primary">
                    ¡Junta 5 visitas y obtendrás un 40% de descuento!
                </p>
                <p className="text-muted-foreground">(Tope de descuento: $50.000)</p>
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
    const { logout, user } = useAuth();
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [selectedBenefitQr, setSelectedBenefitQr] = useState<string | null>(null);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-headline">Hola, {user?.nombre}!</h1>
                 <Button variant="link" onClick={logout}>Cerrar Sesión</Button>
            </div>
           
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">Registrar Visita</CardTitle>
                </CardHeader>
                <CardContent>
                    {!isCameraActive ? (
                         <Button onClick={() => setIsCameraActive(true)} className="w-full bg-green-600 hover:bg-green-700">
                            <QrCode className="mr-2 h-4 w-4" /> Registrar Visita
                        </Button>
                    ) : (
                        <div className="space-y-4 p-4 border-dashed border-2 rounded-lg text-center">
                            <div className="bg-muted aspect-video flex items-center justify-center rounded-md">
                                <Camera className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <Input placeholder="Motivo de la Visita" />
                            <Button onClick={() => setIsCameraActive(false)} className="w-full" variant="destructive">
                                <X className="mr-2 h-4 w-4" /> Cerrar Cámara
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Mis Estadísticas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <p className="text-muted-foreground">Visitas acumuladas</p>
                        <p className="text-6xl font-bold text-primary">{mockVisits.length}</p>
                    </div>
                </CardContent>
            </Card>

            <section>
                <h2 className="text-2xl font-headline mb-4">Beneficios Vigentes</h2>
                {activeBenefits.length > 0 ? (
                    <div className="space-y-4">
                        {activeBenefits.map(benefit => (
                            <Card key={benefit.id} className="bg-secondary">
                                <CardHeader>
                                    <CardTitle>{benefit.name}</CardTitle>
                                    <CardDescription>{benefit.description}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button onClick={() => setSelectedBenefitQr(benefit.qrCode)} className="w-full bg-green-600 hover:bg-green-700">Usar Beneficio</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ): (
                    <p className="text-muted-foreground">Aún no tienes beneficios disponibles. ¡Sigue registrando tus visitas!</p>
                )}
            </section>

             <section>
                <h2 className="text-2xl font-headline mb-4">Beneficios Expirados o Utilizados</h2>
                 {usedBenefits.length > 0 ? (
                    <div className="space-y-4">
                        {usedBenefits.map(benefit => (
                           <Card key={benefit.id} className="opacity-60">
                                <CardHeader>
                                    <CardTitle>{benefit.name}</CardTitle>
                                    <CardDescription>{benefit.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                 ) : (
                    <p className="text-muted-foreground">No tienes beneficios en esta categoría.</p>
                 )}
            </section>

            <section>
                <h2 className="text-2xl font-headline mb-4">Historial de Visitas</h2>
                <Card>
                    <CardContent className="p-0">
                        <ul className="divide-y">
                            {mockVisits.map(visit => (
                                <li key={visit.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{visit.reason}</p>
                                        <p className="text-sm text-muted-foreground">{visit.date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })} - {visit.date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </section>
            
            {selectedBenefitQr && (
                <Dialog open={!!selectedBenefitQr} onOpenChange={() => setSelectedBenefitQr(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-center font-headline text-2xl">¡Canjea tu Beneficio!</DialogTitle>
                        </DialogHeader>
                        <div className="p-4 flex flex-col items-center justify-center text-center">
                            <p className="mb-4">Muestra este código QR al personal del restaurante para activar tu beneficio.</p>
                            <Image src={selectedBenefitQr} alt="Benefit QR Code" width={250} height={250} data-ai-hint="qr code"/>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}


export default function LoyaltyPage() {
    const { isAuthenticated } = useAuth();
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            {isAuthenticated ? <LoggedInView /> : <LoggedOutView />}
        </div>
    );
}
