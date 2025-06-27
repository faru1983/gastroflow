
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState, useCallback } from 'react';
import { Switch } from '@/components/ui/switch';

const reservationSchema = z.object({
  date: z.date({ required_error: 'La fecha es requerida.' }),
  time: z.string().min(1, 'La hora es requerida.'),
  people: z.coerce.number().min(1, "Debe seleccionar al menos 1 persona.").max(8, "Máximo 8 personas."),
  preference: z.string().min(1, 'La preferencia es requerida.'),
  reason: z.string().min(1, 'El motivo es requerido.'),
  comments: z.string().optional(),
  nombre: z.string().min(1, 'Nombre es requerido.'),
  apellidos: z.string().min(1, 'Apellidos son requeridos.'),
  email: z.string().email('Email no válido.'),
  celular: z.string().min(1, 'Celular es requerido.'),
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
  const { isAuthenticated, user, showAuthModal } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const form = useForm<z.infer<typeof reservationSchema>>({
    resolver: zodResolver(reservationSchema),
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  const prefillForm = useCallback(() => {
    if (user) {
        form.reset({
            ...form.getValues(),
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
    if (isAuthenticated && user) {
        prefillForm();
    }
  }, [isAuthenticated, user, prefillForm]);


  const handleLoadData = () => {
    if (isAuthenticated) {
        prefillForm();
        toast({ title: 'Datos cargados', description: 'Tus datos han sido cargados en el formulario.' });
    } else {
        showAuthModal(() => {
            toast({ title: '¡Bienvenido!', description: 'Ahora puedes cargar tus datos.' });
        });
    }
  }
  
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

        setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-headline">Haz tu Reserva</h1>
        <p className="text-muted-foreground">Asegura tu lugar en nuestra mesa.</p>
      </header>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 p-6 border rounded-lg">
                <h3 className="text-lg font-semibold">Datos de la Reserva</h3>
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
            </div>

            <div className="space-y-4 p-6 border rounded-lg">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Datos de Contacto</h3>
                    <Button type="button" variant="link" onClick={handleLoadData}>Cargar Mis Datos</Button>
                </div>
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
                 <FormField
                    control={form.control}
                    name="fechaNacimiento"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="Fecha nacimiento (DD-MM-YYYY)"
                                    {...field}
                                    onChange={(e) => handleDateChange(e, field.onChange)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name="comuna" render={({ field }) => (<FormItem><FormControl><Input placeholder="Comuna (opcional)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="instagram" render={({ field }) => (<FormItem><FormControl><Input placeholder="Instagram (opcional)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField
                  control={form.control}
                  name="promociones"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Suscribirse a mensajes promocionales</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
            </div>

            <Button type="submit" className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Reservar'}
            </Button>
        </form>
      </Form>
    </div>
  );
}
