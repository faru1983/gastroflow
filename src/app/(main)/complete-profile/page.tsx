"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const completeProfileSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido.'),
  apellidos: z.string().min(1, 'Apellidos son requeridos.'),
  fechaNacimiento: z.string().min(1, 'Fecha de nacimiento es requerida.'),
  comuna: z.string().min(1, 'Comuna es requerida.'),
  instagram: z.string().optional(),
  celular: z.string().min(1, 'Celular es requerido.'),
});

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
      fechaNacimiento: user?.fechaNacimiento || '',
      comuna: user?.comuna || '',
      instagram: user?.instagram || '',
      celular: user?.celular || '',
    },
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
            fechaNacimiento: user.fechaNacimiento || '',
            comuna: user.comuna || '',
            instagram: user.instagram || '',
            celular: user.celular || '',
        });
    }
  }, [user, form]);


  function onSubmit(data: z.infer<typeof completeProfileSchema>) {
    setIsLoading(true);
    updateUser(data);
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
                        <FormField control={form.control} name="nombre" render={({ field }) => (<FormItem><FormLabel>Nombre</FormLabel><FormControl><Input placeholder="Tu nombre" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="apellidos" render={({ field }) => (<FormItem><FormLabel>Apellidos</FormLabel><FormControl><Input placeholder="Tus apellidos" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={form.control} name="fechaNacimiento" render={({ field }) => (<FormItem><FormLabel>Fecha de Nacimiento</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="comuna" render={({ field }) => (<FormItem><FormLabel>Comuna</FormLabel><FormControl><Input placeholder="Ej: Las Condes" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="celular" render={({ field }) => (<FormItem><FormLabel>Celular</FormLabel><FormControl><Input placeholder="+569..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="instagram" render={({ field }) => (<FormItem><FormLabel>Instagram (opcional)</FormLabel><FormControl><Input placeholder="@usuario" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Guardar y continuar'}
                    </Button>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
