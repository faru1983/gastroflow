
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
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const completeProfileSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido.'),
  apellidos: z.string().min(1, 'Apellidos son requeridos.'),
  fechaNacimiento: z.string({ required_error: 'Fecha de nacimiento es requerida.' }).min(10, { message: 'Formato debe ser DD-MM-YYYY.' }).refine(val => {
      if (!/^\d{2}-\d{2}-\d{4}$/.test(val)) return false;
      const [day, month, year] = val.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }, { message: "Fecha no válida." }),
  comuna: z.string().optional(),
  instagram: z.string().optional(),
  celular: z.string().min(1, 'Celular es requerido.').refine(val => val.replace(/\D/g, '').length === 11, { message: 'El celular debe tener 11 dígitos en total.' }),
});

export default function CompleteProfilePage() {
  const { toast } = useToast();
  const { user, updateUser, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof completeProfileSchema>>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      nombre: user?.nombre || '',
      apellidos: user?.apellidos || '',
      fechaNacimiento: user?.fechaNacimiento ? user.fechaNacimiento.split('-').reverse().join('-') : '',
      comuna: user?.comuna || '',
      instagram: user?.instagram || '',
      celular: user?.celular || '+569-',
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
        form.reset({
            nombre: user.nombre || '',
            apellidos: user.apellidos || '',
            fechaNacimiento: user.fechaNacimiento ? user.fechaNacimiento.split('-').reverse().join('-') : '',
            comuna: user.comuna || '',
            instagram: user.instagram || '',
            celular: user.celular || '+569-',
        });
    }
  }, [user, form]);

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

  function onSubmit(data: z.infer<typeof completeProfileSchema>) {
    setIsLoading(true);
    const { fechaNacimiento, ...rest } = data;
    const formattedFechaNacimiento = fechaNacimiento.split('-').reverse().join('-');
    
    updateUser({ ...rest, fechaNacimiento: formattedFechaNacimiento, comuna: data.comuna || '' });
    toast({
        title: "¡Perfil completado!",
        description: "Tus datos han sido guardados exitosamente.",
    });

    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push('/profile');
    }
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
                     <FormField
                        control={form.control}
                        name="fechaNacimiento"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Fecha de Nacimiento (DD-MM-YYYY)"
                                        {...field}
                                        onChange={(e) => handleDateChange(e, field.onChange)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="comuna" render={({ field }) => (<FormItem><FormControl><Input placeholder="Comuna" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="celular" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="+569-xxxxxxxx" {...field} onChange={(e) => handlePhoneChange(e, field.onChange)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="instagram" render={({ field }) => (<FormItem><FormControl><Input placeholder="Instagram" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Guardar y continuar'}
                    </Button>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
