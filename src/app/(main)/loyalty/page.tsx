
"use client";

import { useState } from 'react';
import type { Visit, Benefit } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Camera, X } from 'lucide-react';
import { mockVisits, activeBenefits as initialActiveBenefits, usedBenefits as initialUsedBenefits } from '@/lib/data';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

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
    const { toast } = useToast();

    const [isCameraActive, setIsCameraActive] = useState(false);
    const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);

    // State for dynamic data
    const [visits, setVisits] = useState<Visit[]>(mockVisits);
    const [activeBenefits, setActiveBenefits] = useState<Benefit[]>(initialActiveBenefits);
    const [usedBenefits, setUsedBenefits] = useState<Benefit[]>(initialUsedBenefits);
    const [newVisitReason, setNewVisitReason] = useState('');

    const visitsToNextReward = visits.length % 5;

    const handleRegisterVisit = () => {
        if (!newVisitReason) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Por favor, selecciona un motivo para tu visita.",
            });
            return;
        }

        const newVisit: Visit = {
            id: `v${visits.length + 1}`,
            date: new Date(),
            reason: newVisitReason,
        };

        const updatedVisits = [newVisit, ...visits];
        setVisits(updatedVisits);

        toast({
            title: "¡Visita Registrada!",
            description: "Gracias por visitarnos. Tu visita ha sido añadida a tu historial.",
        });

        if (updatedVisits.length > 0 && updatedVisits.length % 5 === 0) {
            const newBenefit: Benefit = {
                id: `b${Date.now()}`,
                name: '40% de Descuento',
                description: `¡Felicidades! Has acumulado 5 visitas. Disfruta de un 40% de descuento en tu próxima cuenta (tope $50.000).`,
                qrCode: 'https://placehold.co/300x300.png'
            };
            setActiveBenefits(prev => [...prev, newBenefit]);
            toast({
                title: "¡Nuevo Beneficio Obtenido!",
                description: "Has ganado un 40% de descuento. ¡Revisa tus beneficios disponibles!",
                className: 'bg-green-600 text-primary-foreground'
            });
        }

        setIsCameraActive(false);
        setNewVisitReason('');
    };
    
    const handleUseBenefit = () => {
        if (!selectedBenefit) return;

        setActiveBenefits(prev => prev.filter(b => b.id !== selectedBenefit.id));
        
        const usedBenefit: Benefit = {
          ...selectedBenefit,
          description: `Utilizado el ${new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        };
        setUsedBenefits(prev => [usedBenefit, ...prev]);
    
        toast({
            title: "¡Beneficio Canjeado!",
            description: "Tu beneficio ha sido marcado como usado.",
        });
    
        setSelectedBenefit(null);
    };

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
                            <Select value={newVisitReason} onValueChange={setNewVisitReason}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Motivo de la Visita" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="General">General</SelectItem>
                                    <SelectItem value="Celebración">Celebración</SelectItem>
                                    <SelectItem value="Cumpleaños">Cumpleaños</SelectItem>
                                    <SelectItem value="Cita">Cita</SelectItem>
                                    <SelectItem value="Negocios">Negocios</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Button onClick={handleRegisterVisit} className="w-full">
                                    Guardar Visita
                                </Button>
                                <Button onClick={() => setIsCameraActive(false)} variant="ghost">
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Mis Estadísticas</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                     <div>
                        <p className="text-muted-foreground">Progreso para próximo beneficio</p>
                        <div className="flex items-center gap-4 mt-2">
                            <Progress value={visitsToNextReward * 20} className="w-full" />
                            <p className="text-lg font-bold text-primary">{visitsToNextReward}/5</p>
                        </div>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Visitas totales</p>
                        <p className="text-4xl font-bold">{visits.length}</p>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="disponibles" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="disponibles">Beneficios Vigentes</TabsTrigger>
                    <TabsTrigger value="usados">Expirados o Usados</TabsTrigger>
                    <TabsTrigger value="visitas">Historial de Visitas</TabsTrigger>
                </TabsList>
                <TabsContent value="disponibles">
                    <div className="mt-4">
                        {activeBenefits.length > 0 ? (
                            <div className="space-y-4">
                                {activeBenefits.map(benefit => (
                                    <Card key={benefit.id} className="bg-secondary">
                                        <CardHeader>
                                            <CardTitle>{benefit.name}</CardTitle>
                                            <CardDescription>{benefit.description}</CardDescription>
                                        </CardHeader>
                                        <CardFooter>
                                            <Button onClick={() => setSelectedBenefit(benefit)} className="w-full bg-green-600 hover:bg-green-700">Usar Beneficio</Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ): (
                            <div className="text-center text-muted-foreground py-12">
                                <p>Aún no tienes beneficios disponibles. ¡Sigue registrando tus visitas!</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="usados">
                    <div className="mt-4">
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
                            <div className="text-center text-muted-foreground py-12">
                                <p>No tienes beneficios en esta categoría.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="visitas">
                    <Card className="mt-4">
                        <CardContent className="p-0">
                            {visits.length > 0 ? (
                                <ul className="divide-y">
                                    {visits.map(visit => (
                                        <li key={visit.id} className="p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{visit.reason}</p>
                                                <p className="text-sm text-muted-foreground">{visit.date.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })} - {visit.date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center text-muted-foreground py-12">
                                    <p>No has registrado ninguna visita todavía.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            {selectedBenefit && (
                <Dialog open={!!selectedBenefit} onOpenChange={() => setSelectedBenefit(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-center font-headline text-2xl">¡Canjea tu Beneficio!</DialogTitle>
                        </DialogHeader>
                        <div className="p-4 flex flex-col items-center justify-center text-center">
                            <p className="mb-4">Muestra este código QR al personal para activar tu beneficio. Al marcarlo como usado, desaparecerá de tus beneficios vigentes.</p>
                            <Image src={selectedBenefit.qrCode} alt="Benefit QR Code" width={250} height={250} data-ai-hint="qr code"/>
                            <Button onClick={handleUseBenefit} className="w-full mt-6 bg-green-600 hover:bg-green-700">
                                Marcar como Usado
                            </Button>
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

    