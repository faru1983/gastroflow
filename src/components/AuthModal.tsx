"use client";

import { useState } from 'react';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email no válido.'),
  password: z.string().min(1, 'Contraseña es requerida.'),
});

const registerSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido.'),
  apellidos: z.string().min(1, 'Apellidos son requeridos.'),
  fechaNacimiento: z.string().min(1, 'Fecha de nacimiento es requerida.'),
  comuna: z.string().min(1, 'Comuna es requerida.'),
  instagram: z.string().optional(),
  email: z.string().email('Email no válido.'),
  celular: z.string().min(1, 'Celular es requerido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  promociones: z.boolean().default(false),
});

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      apellidos: '',
      fechaNacimiento: '',
      comuna: '',
      instagram: '',
      email: '',
      celular: '',
      password: '',
      promociones: false,
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    const success = await login(values.email, values.password);
    if (!success) {
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
    const { password, ...userData } = values;
    const success = await register(userData);
    if (!success) {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-headline">GastroHub</DialogTitle>
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
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                   {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}
                </Button>
                 <Button variant="link" size="sm" className="w-full">Olvidé mi contraseña</Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="registrar">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-2 pt-4 max-h-[60vh] overflow-y-auto pr-2">
                <FormField name="nombre" control={registerForm.control} render={({ field }) => (<FormItem><FormControl><Input placeholder="Nombre" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="apellidos" control={registerForm.control} render={({ field }) => (<FormItem><FormControl><Input placeholder="Apellidos" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="fechaNacimiento" control={registerForm.control} render={({ field }) => (<FormItem><FormLabel>Fecha de Nacimiento</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="comuna" control={registerForm.control} render={({ field }) => (<FormItem><FormControl><Input placeholder="Comuna" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="instagram" control={registerForm.control} render={({ field }) => (<FormItem><FormControl><Input placeholder="Instagram (opcional)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="email" control={registerForm.control} render={({ field }) => (<FormItem><FormControl><Input type="email" placeholder="E-mail" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="celular" control={registerForm.control} render={({ field }) => (<FormItem><FormControl><Input placeholder="Celular" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="password" control={registerForm.control} render={({ field }) => (<FormItem><FormControl><Input type="password" placeholder="Contraseña" {...field} /></FormControl><FormMessage /></FormItem>)} />
                
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Registrar'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
