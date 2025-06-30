
"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Switch } from './ui/switch';
import { ScrollArea } from './ui/scroll-area';

const loginSchema = z.object({
  email: z.string().email('Email no válido.'),
  password: z.string().min(1, 'Contraseña es requerida.'),
});

const registerSchema = z.object({
  email: z.string().email('Email no válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  nombre: z.string().min(1, 'Nombre es requerido.'),
  apellidos: z.string().min(1, 'Apellidos son requeridos.'),
  fechaNacimiento: z.string().min(1, 'Fecha de nacimiento es requerida.').refine(val => {
      if (!val) return true;
      if (!/^\d{2}-\d{2}-\d{4}$/.test(val)) return false;
      const [day, month, year] = val.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }, { message: "Fecha no válida. Usa el formato DD-MM-YYYY." }),
  celular: z.string().min(1, 'Celular es requerido.').refine(val => val.replace(/\D/g, '').length === 11, { message: 'El celular debe tener 11 dígitos en total.' }),
  comuna: z.string().optional(),
  instagram: z.string().optional(),
  promociones: z.boolean().default(true),
});


export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      nombre: '',
      apellidos: '',
      fechaNacimiento: '',
      celular: '+569-',
      comuna: '',
      instagram: '',
      promociones: true,
    },
    mode: 'onChange',
  });
  
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

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    const result = await login(values.email, values.password);
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "Email o contraseña incorrectos.",
      });
    }
    setIsLoading(false);
  };

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    const result = await register(values);
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: "No se pudo crear la cuenta. Intente nuevamente.",
      });
    } else {
      toast({
        title: "¡Bienvenido!",
        description: "Tu cuenta ha sido creada exitosamente.",
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-headline">GastroFlow</DialogTitle>
          <DialogDescription className="text-center">
            Accede a tu cuenta para disfrutar de todos los beneficios.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="registrar">Registrar</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="password" placeholder="Contraseña" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                   {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}
                </Button>
                 <Button variant="link" size="sm" className="w-full">Olvidé mi contraseña</Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="registrar">
            <ScrollArea className="h-96 w-full pr-4">
              <Form {...registerForm}>
                 <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 pt-4">
                  <FormField name="email" control={registerForm.control} render={({ field }) => (<FormItem><FormControl><Input type="email" placeholder="E-mail" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField name="password" control={registerForm.control} render={({ field }) => (<FormItem><FormControl><Input type="password" placeholder="Contraseña" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={registerForm.control} name="nombre" render={({ field }) => (<FormItem><FormControl><Input placeholder="Nombre" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={registerForm.control} name="apellidos" render={({ field }) => (<FormItem><FormControl><Input placeholder="Apellidos" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={registerForm.control} name="fechaNacimiento" render={({ field }) => (<FormItem><FormControl><Input placeholder="Fecha de Nacimiento (DD-MM-YYYY)" {...field} onChange={(e) => handleDateChange(e, field.onChange)}/></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={registerForm.control} name="celular" render={({ field }) => (<FormItem><FormControl><Input placeholder="+569-xxxxxxxx" {...field} onChange={(e) => handlePhoneChange(e, field.onChange)} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={registerForm.control} name="comuna" render={({ field }) => (<FormItem><FormControl><Input placeholder="Comuna" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={registerForm.control} name="instagram" render={({ field }) => (<FormItem><FormControl><Input placeholder="Instagram" {...field} /></FormControl><FormMessage /></FormItem>)} />

                  <FormField
                    control={registerForm.control}
                    name="promociones"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Mensajes Promocionales</FormLabel>
                          <FormDescription className="text-xs">
                            Recibe ofertas y noticias en tu email.
                          </FormDescription>
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
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Crear Cuenta'}
                  </Button>
                </form>
              </Form>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
