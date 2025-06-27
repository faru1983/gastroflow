"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const completeProfileSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido.'),
  apellidos: z.string().min(1, 'Apellidos son requeridos.'),
  day: z.string({ required_error: "Día es requerido."}),
  month: z.string({ required_error: "Mes es requerido."}),
  year: z.string({ required_error: "Año es requerido."}),
  comuna: z.string().optional(),
  instagram: z.string().optional(),
  celular: z.string().min(1, 'Celular es requerido.'),
}).refine(data => {
    if (!data.year || !data.month || !data.day) return true;
    const year = parseInt(data.year, 10);
    const month = parseInt(data.month, 10);
    const day = parseInt(data.day, 10);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}, {
    message: "Fecha no válida.",
    path: ["day"], 
});

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), label: new Date(2000, i, 1).toLocaleString('es-CL', { month: 'long' }) }));
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());


export default function CompleteProfilePage() {
  const { toast } = useToast();
  const { user, updateUser, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof completeProfileSchema>>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      nombre: user?.nombre || '',
      apellidos: user?.apellidos || '',
      day: user?.fechaNacimiento?.split('-')[2] || '',
      month: user?.fechaNacimiento?.split('-')[1] || '',
      year: user?.fechaNacimiento?.split('-')[0] || '',
      comuna: user?.comuna || '',
      instagram: user?.instagram || '',
      celular: user?.celular || '',
    },
    mode: 'onChange',
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
        router.replace('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
        const [year, month, day] = user.fechaNacimiento?.split('-') || ['', '', ''];
        form.reset({
            nombre: user.nombre || '',
            apellidos: user.apellidos || '',
            day: day || '',
            month: month || '',
            year: year || '',
            comuna: user.comuna || '',
            instagram: user.instagram || '',
            celular: user.celular || '',
        });
    }
  }, [user, form]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, fieldOnChange: (...event: any[]) => void) => {
    let value = e.target.value;
    let cleaned = value.startsWith('+') ? '+' + value.substring(1).replace(/\D/g, '') : value.replace(/\D/g, '');
    
    if (cleaned.length > 12) { // e.g. +56912345678 -> 12 chars
        cleaned = cleaned.substring(0, 12);
    }

    let formattedValue = cleaned;
    if (cleaned.length > 4) { // Add dash after country code
        formattedValue = `${cleaned.substring(0, 4)}-${cleaned.substring(4)}`;
    }
    
    fieldOnChange(formattedValue);
  };


  function onSubmit(data: z.infer<typeof completeProfileSchema>) {
    setIsLoading(true);
    const { day, month, year, ...rest } = data;
    const fechaNacimiento = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    updateUser({ ...rest, fechaNacimiento });
    toast({
        title: "¡Perfil completado!",
        description: "Tus datos han sido guardados exitosamente.",
    });
    router.push('/profile');
    setIsLoading(false);
  }

  if (!user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">¡Casi listo! Completa tu perfil</CardTitle>
          <CardDescription>Necesitamos algunos datos más para personalizar tu experiencia.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="nombre" render={({ field }) => (<FormItem><FormControl><Input placeholder="Nombre" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="apellidos" render={({ field }) => (<FormItem><FormControl><Input placeholder="Apellidos" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                     <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</p>
                        <div className="grid grid-cols-3 gap-4">
                            <FormField control={form.control} name="day" render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Día" /></SelectTrigger></FormControl>
                                        <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="month" render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Mes" /></SelectTrigger></FormControl>
                                        <SelectContent>{months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="year" render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Año" /></SelectTrigger></FormControl>
                                        <SelectContent>{years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )} />
                        </div>
                    </div>
                    <FormField control={form.control} name="comuna" render={({ field }) => (<FormItem><FormControl><Input placeholder="Comuna (opcional)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="celular" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="+569-xxxxxxxx" {...field} onChange={(e) => handlePhoneChange(e, field.onChange)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="instagram" render={({ field }) => (<FormItem><FormControl><Input placeholder="Instagram (opcional)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading || !form.formState.isValid}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Guardar y continuar'}
                    </Button>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
