
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState, useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const reservationSchema = z.object({
  date: z.date({ required_error: 'La fecha es requerida.' }),
  time: z.string().min(1, 'La hora es requerida.'),
  people: z.coerce.number({ invalid_type_error: "Debes seleccionar la cantidad de personas." }).min(1, "Debe seleccionar al menos 1 persona.").max(8, "Máximo 8 personas."),
  preference: z.string().min(1, 'La preferencia es requerida.'),
  reason: z.string().min(1, 'El motivo es requerido.'),
  comments: z.string().optional(),
  nombre: z.string().min(1, 'Nombre es requerido.'),
  apellidos: z.string().min(1, 'Apellidos son requeridos.'),
  email: z.string().email('Email no válido.'),
  celular: z.string().min(1, 'Celular es requerido.').refine(val => val.replace(/\D/g, '').length === 11, { message: 'El celular debe tener 11 dígitos en total.' }),
  fechaNacimiento: z.string().optional().or(z.literal("")).refine((val) => {
    if (!val) return true;
    if (!/^\d{2}-\d{2}-\d{4}$/.test(val)) return false;
    const [day, month, year] = val.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }, { message: "Fecha no válida. Usa el formato DD-MM-YYYY." }),
  comuna: z.string().optional(),
  instagram: z.string().optional(),
  promociones: z.boolean().default(true),
});

const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = 18 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const defaultValues = {
  date: undefined,
  time: '',
  people: undefined,
  preference: '',
  reason: '',
  comments: '',
  nombre: '',
  apellidos: '',
  email: '',
  celular: '+569-',
  fechaNacimiento: '',
  comuna: '',
  instagram: '',
  promociones: true,
};

export default function ReservationsPage() {
  const { toast } = useToast();
  const { isAuthenticated, user, showAuthModal, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof reservationSchema>>({
    resolver: zodResolver(reservationSchema),
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  const prefillForm = useCallback((pendingData: any = {}) => {
    if (user) {
        form.reset({
            ...form.getValues(),
            ...pendingData,
            nombre: user.nombre || '',
            apellidos: user.apellidos || '',
            email: user.email || '',
            celular: user.celular || '+569-',
            fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.split('-').reverse().join('-') : '',
            comuna: user.comuna || '',
            instagram: user.instagram || '',
            promociones: user.promociones ?? true,
        });
    }
  }, [user, form]);

  useEffect(() => {
    const pendingReservationJSON = localStorage.getItem('pendingReservation');
    if (pendingReservationJSON && isAuthenticated) {
        const data = JSON.parse(pendingReservationJSON);
        if (data.date) {
            data.date = new Date(data.date);
        }
        prefillForm(data);
        localStorage.removeItem('pendingReservation');
        setStep(3);
        toast({ title: '¡Bienvenido!', description: 'Continúa con tu reserva.' });
    } else if (isAuthenticated) {
        prefillForm();
    }
  }, [isAuthenticated, user, prefillForm, form, toast]);


  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, fieldOnChange: (...event: any[]) => void) => {
    let value = e.target.value;
    if (!value.startsWith('+')) {
      value = '+' + value.replace(/\D/g, '');
    } else {
      value = '+' + value.substring(1).replace(/\D/g, '');
    }
    if (value === '+') {
      value = '+569-';
    }
    let numericValue = value.substring(1).replace(/\D/g, '');
    if (numericValue.length > 11) {
        numericValue = numericValue.substring(0, 11);
    }
    let formatted = '+' + numericValue;
    if (numericValue.length > 3) {
        formatted = `+${numericValue.substring(0, 3)}-${numericValue.substring(3)}`;
    }
    fieldOnChange(formatted);
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, fieldOnChange: (...event: any[]) => void) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) {
        value = value.substring(0, 8);
    }
    let formattedValue = '';
    if (value.length > 4) {
        formattedValue = `${value.substring(0, 2)}-${value.substring(2, 4)}-${value.substring(4)}`;
    } else if (value.length > 2) {
        formattedValue = `${value.substring(0, 2)}-${value.substring(2)}`;
    } else {
        formattedValue = value;
    }
    fieldOnChange(formattedValue);
  };

  const handleNext = async () => {
    const fields: (keyof z.infer<typeof reservationSchema>)[] = ['date', 'time', 'people', 'preference', 'reason'];
    const isValid = await form.trigger(fields);
    if (isValid) {
      if (isAuthenticated) {
        setStep(3);
      } else {
        setStep(2);
      }
    }
  };

  const handleLogin = () => {
    const reservationData = form.getValues();
    if (reservationData.date && reservationData.time && reservationData.people) {
      localStorage.setItem('pendingReservation', JSON.stringify({
        date: reservationData.date,
        time: reservationData.time,
        people: reservationData.people,
        preference: reservationData.preference,
        reason: reservationData.reason,
        comments: reservationData.comments,
      }));
    }
    showAuthModal({
      onLoginSuccess: () => {
        toast({ title: '¡Bienvenido!', description: 'Tus datos han sido cargados en el formulario.' });
        setStep(3);
      },
    });
  };

  function onSubmit(data: z.infer<typeof reservationSchema>) {
    setIsLoading(true);
    console.log(data);
    setTimeout(() => {
        toast({
            title: '¡Reserva Confirmada!',
            description: `Gracias ${data.nombre}, tu mesa para ${data.people} ha sido reservada para el ${format(data.date, 'PPP', { locale: es })} a las ${data.time}.`,
        });
        
        const newDefaultValues: z.infer<typeof reservationSchema> | {} = {
            ...defaultValues,
            date: undefined,
            people: undefined,
            time: '',
            preference: '',
            reason: '',
            comments: '',
        };

        if (isAuthenticated && user) {
            (newDefaultValues as any).nombre = user.nombre || '';
            (newDefaultValues as any).apellidos = user.apellidos || '';
            (newDefaultValues as any).email = user.email || '';
            (newDefaultValues as any).celular = user.celular || '+569-';
            (newDefaultValues as any).fechaNacimiento = user.fechaNacimiento ? user.fechaNacimiento.split('-').reverse().join('-') : '';
            (newDefaultValues as any).comuna = user.comuna || '';
            (newDefaultValues as any).instagram = user.instagram || '';
            (newDefaultValues as any).promociones = user.promociones ?? true;
        }

        form.reset(newDefaultValues);
        setStep(1);
        setIsLoading(false);
    }, 1500);
  }

   const Stepper = (
    <div className="flex items-center justify-center w-full mb-8">
        <div className="flex items-center">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors", step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>1</div>
            <p className={cn("ml-2 font-semibold transition-colors hidden md:block", step >= 1 ? 'text-foreground' : 'text-muted-foreground')}>Reserva</p>
        </div>
        <div className="flex-1 h-px bg-border mx-2 md:mx-4" />
        <div className="flex items-center">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors", step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>2</div>
            <p className={cn("ml-2 font-semibold transition-colors hidden md:block", step >= 2 ? 'text-foreground' : 'text-muted-foreground')}>Usuario</p>
        </div>
        <div className="flex-1 h-px bg-border mx-2 md:mx-4" />
        <div className="flex items-center">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors", step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>3</div>
            <p className={cn("ml-2 font-semibold transition-colors hidden md:block", step >= 3 ? 'text-foreground' : 'text-muted-foreground')}>Contacto</p>
        </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <header className="mb-8">
        <div className="flex justify-between items-center">
            <h1 className="text-4xl font-headline">Haz tu Reserva</h1>
            {isAuthenticated && (
                <Button variant="link" onClick={logout}>
                    Cerrar Sesión
                </Button>
            )}
        </div>
        <p className="text-muted-foreground">Asegura tu lugar en nuestra mesa.</p>
      </header>
      
      {Stepper}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>1. Datos de la Reserva</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="date" render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal justify-start", !field.value && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                            {field.value ? format(field.value, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={(date) => { if (date) {field.onChange(date)}; setIsCalendarOpen(false); }} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus/>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="time" render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value || ''}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Selecciona hora" /></SelectTrigger></FormControl>
                                        <SelectContent>{timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot} hrs</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="people" render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : ''}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Cantidad personas" /></SelectTrigger></FormControl>
                                        <SelectContent>{Array.from({ length: 8 }, (_, i) => i + 1).map(p => <SelectItem key={p} value={String(p)}>{p} persona{p>1 && 's'}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="preference" render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value || ''}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Lugar preferencia" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Interior">Interior</SelectItem>
                                            <SelectItem value="Terraza">Terraza</SelectItem>
                                            <SelectItem value="Barra">Barra</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="reason" render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} value={field.value || ''}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Motivo visita" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="General">General</SelectItem>
                                        <SelectItem value="Celebración">Celebración</SelectItem>
                                        <SelectItem value="Cumpleaños">Cumpleaños</SelectItem>
                                        <SelectItem value="Cita">Cita</SelectItem>
                                        <SelectItem value="Negocios">Negocios</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="comments" render={({ field }) => (
                            <FormItem>
                                <FormControl><Textarea placeholder="Comentarios (alergias, preferencias, etc.)" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="button" onClick={handleNext} className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90">
                          Continuar
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>2. ¿Quién reserva?</CardTitle>
                        <CardDescription>
                            Crea una cuenta o inicia sesión para ver tu historial de reservas y acceder a beneficios exclusivos en nuestro programa de fidelización.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button type="button" onClick={handleLogin} className="w-full text-lg py-6">
                            Iniciar Sesión / Registrarse
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setStep(3)} className="w-full">
                            Continuar sin registrarse
                        </Button>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <Button type="button" variant="link" onClick={() => setStep(1)}>Volver</Button>
                    </CardFooter>
                </Card>
            )}

            {step === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle>3. Datos de Contacto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="nombre" render={({ field }) => (<FormItem><FormControl><Input placeholder="Nombre" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="apellidos" render={({ field }) => (<FormItem><FormControl><Input placeholder="Apellidos" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormControl><Input type="email" placeholder="Email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="celular" render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input placeholder="+569-xxxxxxxx" {...field} onChange={(e) => handlePhoneChange(e, field.onChange)}/></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="fechaNacimiento" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Fecha nacimiento (DD-MM-YYYY)" {...field} onChange={(e) => handleDateChange(e, field.onChange)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="comuna" render={({ field }) => (<FormItem><FormControl><Input placeholder="Comuna" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="instagram" render={({ field }) => (<FormItem><FormControl><Input placeholder="Instagram" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="promociones" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                    <p>Suscribirse a mensajes promocionales</p>
                                </div>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}/>
                    </CardContent>
                     <CardFooter className="flex-col gap-2 items-center">
                        <Button type="submit" className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Confirmar Reserva'}
                        </Button>
                        <Button type="button" variant="link" onClick={() => setStep(isAuthenticated ? 1 : 2)}>Volver</Button>
                    </CardFooter>
                </Card>
            )}
        </form>
      </Form>
    </div>
  );
}
