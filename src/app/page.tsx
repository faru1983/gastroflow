import Link from "next/link";
import { Button, Card, Input, Badge } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import {
  UtensilsCrossed,
  CalendarCheck,
  Heart,
  BarChart3,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Smartphone,
  Zap,
  ShieldCheck,
  MessageSquare,
  Globe,
  Share2
} from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: featuredRestaurants } = await supabase
    .from('restaurants')
    .select('name, slug, logo_url')
    .eq('is_featured', true)
    .limit(3);

  return (
    <div className="bg-surface font-sans text-on-surface selection:bg-primary/20" data-theme="light">
      {/* --- Navigation --- */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[8px] gradient-primary flex items-center justify-center shadow-sm">
            <UtensilsCrossed size={18} strokeWidth={1.5} className="text-on-primary-container" />
          </div>
          <span className="text-lg font-bold tracking-tight text-on-surface">
            Gastroflow
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            <Link href="#features" className="hover:text-primary transition-colors">Funcionalidades</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">Cómo funciona</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Planes</Link>
            <Link href="#contact" className="hover:text-primary transition-colors">Contacto</Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/login">Ingresar</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Probar Gratis</Link>
          </Button>
        </div>
      </nav>

      <main>
        {/* --- Hero Section --- */}
        <section className="relative px-6 pt-16 pb-12 overflow-hidden bg-gradient-to-b from-primary-container/10 to-surface">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Badge variant="primary" className="mb-6 py-1 px-4 text-xs tracking-wide">
               NUEVA VERSIÓN 4.0 DISPONIBLE
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-on-surface mb-6">
              Digitaliza tu restaurante <br />
              <span className="text-primary italic">en minutos, no días</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
              La plataforma integral para el mercado chileno. Carta QR, Reservas inteligentes, Fidelización y Analítica en una sola suscripción.
            </p>
            <div className="flex flex-col items-center gap-8 mt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-primary/20" asChild>
                  <Link href="/register">
                      Comenzar prueba gratuita
                      <ArrowRight size={18} />
                  </Link>
                </Button>
                
                {(!featuredRestaurants || featuredRestaurants.length === 0) && (
                  <Button variant="outline" size="lg" className="h-14 px-8 text-base border-outline-variant bg-surface hover:bg-surface-container-low">
                    Ver restaurante demo
                  </Button>
                )}
              </div>

              {featuredRestaurants && featuredRestaurants.length > 0 && (
                <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-[0.3em] mb-6">
                    Restaurantes que ya confían en nosotros
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {featuredRestaurants.map((res) => (
                      <Link 
                        key={res.slug} 
                        href={`/${res.slug}`}
                        target="_blank"
                        className="group relative flex items-center gap-3 bg-surface-container border border-outline-variant/30 px-5 py-3 rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm active:scale-95"
                      >
                        {res.logo_url && (
                          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-white/10 shrink-0 border border-outline-variant/10">
                            <img src={res.logo_url} alt={res.name} className="object-cover w-full h-full" />
                          </div>
                        )}
                        <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                          {res.name}
                        </span>
                        <ArrowRight size={14} className="text-outline opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <p className="mt-6 text-xs text-on-surface-variant/70 font-medium">
               🚀 No requiere tarjeta de crédito · 30 días liberado
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </section>

        {/* --- Trusted By / Stats --- */}
        <section className="py-12 border-y border-outline-variant/20 bg-surface-container-low/30">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
                <StatItem label="Restaurantes" value="+500" />
                <StatItem label="Reservas procesadas" value="+120k" />
                <StatItem label="Uptime garantizado" value="99.9%" />
                <StatItem label="Países" value="CL, AR, CO" />
            </div>
        </section>

        {/* --- Features Grid --- */}
        <section id="features" className="px-6 py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">Potencia tu negocio</h2>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface">Todo en una sola herramienta</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<QrCode size={24} />}
              title="Carta Digital QR"
              description="Menús dinámicos que se actualizan al instante. Olvida las impresiones caras y mantén tus precios al día."
              features={["Cambio de precios real", "Fotos en alta definición", "Categorización inteligente"]}
            />
            <FeatureCard
              icon={<CalendarCheck size={24} />}
              title="Gestión de Reservas"
              description="Sistema automatizado de reservaciones con control de aforo y confirmación automática vía email."
              features={["Slots de tiempo configurables", "Recordatorios automáticos", "Lista de espera"]}
            />
            <FeatureCard
              icon={<Heart size={24} />}
              title="Programa de Fidelización"
              description="Convierte clientes casuales en frecuentes con nuestro sistema de puntos y recompensas integradas."
              features={["Registro con QR cliente", "Canje de puntos en local", "Base de datos segmentada"]}
            />
            <FeatureCard
              icon={<BarChart3 size={24} />}
              title="Analítica de Ventas"
              description="Entiende qué platos son tus 'estrellas' y cuáles no están funcionando. Datos reales para decidir mejor."
              features={["Reportes diarios automáticos", "Mapa de calor de consumo", "Exportación a Excel/PDF"]}
            />
            <FeatureCard
              icon={<Smartphone size={24} />}
              title="Dashboard Mobile"
              description="Gestiona todo desde tu celular. El administrador tiene el control total esté donde esté."
              features={["Notificaciones push", "Cierre de días remoto", "Gestión de personal"]}
            />
            <FeatureCard
              icon={<ShieldCheck size={24} />}
              title="Seguridad Industrial"
              description="Tus datos y los de tus clientes están protegidos con encriptación bancaria y respaldos diarios."
              features={["Cumplimiento ley de datos", "Certificados SSL", "Soporte 24/7"]}
            />
          </div>
        </section>

        {/* --- How it Works --- */}
        <section id="how-it-works" className="bg-surface-container-low px-6 py-24">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-4">Empieza hoy mismo</h2>
                    <p className="text-on-surface-variant max-w-xl mx-auto">Configurar Gastroflow es más fácil que preparar un espresso.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-[2px] bg-outline-variant/30 z-0" />
                    <StepItem 
                      number="01" 
                      title="Crea tu cuenta" 
                      description="Regístrate en menos de 2 minutos. No pedimos tarjeta de crédito para empezar."
                    />
                    <StepItem 
                      number="02" 
                      title="Sube tu carta" 
                      description="Carga tus platos, precios y fotos. Nuestro asistente te ayuda a organizarlas."
                    />
                    <StepItem 
                      number="03" 
                      title="Imprime tu QR" 
                      description="Descarga tus códigos QR personalizados y empieza a recibir pedidos y reservas."
                    />
                </div>
            </div>
        </section>

        {/* --- Detailed Pricing --- */}
        <section id="pricing" className="px-6 py-24 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-4">Planes que crecen contigo</h2>
            <p className="text-on-surface-variant">Sin contratos de amarre. Cambia de plan o cancela cuando quieras.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plan Basic */}
            <Card className="p-8 border border-outline-variant/50 hover:border-primary/30 transition-all group">
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Plan Basic</h3>
                    <p className="text-sm text-on-surface-variant">Para cafeterías y locales en crecimiento.</p>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold text-on-surface tracking-tight">$19.990</span>
                    <span className="text-on-surface-variant font-medium">/mes + IVA</span>
                </div>
                <ul className="space-y-4 mb-10">
                    <PricingFeature>Carta Digital QR Ilimitada</PricingFeature>
                    <PricingFeature>Hasta 100 Reservas / mes</PricingFeature>
                    <PricingFeature>Soporte por Email</PricingFeature>
                    <PricingFeature>Panel Admin Mobile</PricingFeature>
                    <PricingFeature disabled>Módulo de Fidelización</PricingFeature>
                    <PricingFeature disabled>Analíticas Avanzadas</PricingFeature>
                </ul>
                <Button fullWidth variant="outline" className="h-12 border-outline-variant hover:bg-surface-container-low group-hover:border-primary/50" asChild>
                    <Link href="/register">Elegir Basic</Link>
                </Button>
            </Card>

            {/* Plan Pro */}
            <Card className="p-8 border-2 border-primary relative shadow-2xl shadow-primary/10 overflow-hidden">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary text-on-primary-container text-[11px] font-bold uppercase tracking-widest rounded-bl-xl">
                    Más Popular
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Plan Pro</h3>
                    <p className="text-sm text-on-surface-variant">Para restaurantes que buscan control total.</p>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold text-primary tracking-tight">$39.990</span>
                    <span className="text-on-surface-variant font-medium">/mes + IVA</span>
                </div>
                <ul className="space-y-4 mb-10">
                    <PricingFeature primary>Todo lo de Basic</PricingFeature>
                    <PricingFeature primary>Reservas ILIMITADAS</PricingFeature>
                    <PricingFeature primary>Fidelización (Puntos y CRM)</PricingFeature>
                    <PricingFeature primary>Analítica con Inteligencia de Negocio</PricingFeature>
                    <PricingFeature primary>Soporte Priority 24/7</PricingFeature>
                    <PricingFeature primary>API para Integraciones</PricingFeature>
                </ul>
                <Button fullWidth className="h-12 gradient-primary shadow-lg shadow-primary/20" asChild>
                    <Link href="/register">Adquirir Pro ahora</Link>
                </Button>
            </Card>
          </div>
        </section>

        {/* --- Contact Form Section --- */}
        <section id="contact" className="px-6 py-24 bg-surface-container-low">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-6">¿Tienes dudas? <br /> Conversemos.</h2>
                    <p className="text-on-surface-variant mb-10 leading-relaxed">
                        Nuestro equipo de especialistas está listo para ayudarte a encontrar la mejor solución para tu restaurante. Respondemos en menos de 2 horas.
                    </p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-on-surface-variant uppercase">Email</p>
                                <p className="text-sm font-semibold">hola@gastroflow.cl</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-on-surface-variant uppercase">Ventas</p>
                                <p className="text-sm font-semibold">+56 2 2345 6789</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-on-surface-variant uppercase">Oficina</p>
                                <p className="text-sm font-semibold">Av. Providencia 1234, Santiago, Chile</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl p-8 shadow-xl shadow-surface-container-highest/20 border border-outline-variant/10">
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Tu Nombre" placeholder="Ej: Juan Pérez" />
                            <Input label="Tu Email" placeholder="ejemplo@email.com" />
                        </div>
                        <Input label="Nombre del Restaurante" placeholder="Ej: La Trattoria" />
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-on-surface-variant uppercase">Mensaje</label>
                            <textarea 
                                className="w-full min-h-[120px] p-3 rounded-lg bg-surface-container-high border border-outline-variant/30 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="Cuéntanos en qué podemos ayudarte..."
                            />
                        </div>
                        <Button fullWidth className="h-12">
                            Enviar Mensaje
                            <Zap size={16} />
                        </Button>
                    </form>
                </div>
            </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-surface border-t border-outline-variant/20 pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center">
                            <UtensilsCrossed size={14} className="text-on-primary-container" />
                        </div>
                        <span className="text-base font-bold tracking-tight">Gastroflow</span>
                    </div>
                    <p className="text-sm text-on-surface-variant italic">
                        Transformando restaurantes análogos en experiencias digitales memorables.
                    </p>
                    <div className="flex items-center gap-3">
                        <SocialLink icon={<Globe size={18} />} />
                        <SocialLink icon={<Share2 size={18} />} />
                        <SocialLink icon={<Mail size={18} />} />
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-5">Producto</h4>
                    <ul className="space-y-3 text-sm text-on-surface-variant">
                        <li><Link href="#features" className="hover:text-primary transition-colors">Carta Digital</Link></li>
                        <li><Link href="#features" className="hover:text-primary transition-colors">Reservas Online</Link></li>
                        <li><Link href="#features" className="hover:text-primary transition-colors">Fidelización</Link></li>
                        <li><Link href="#features" className="hover:text-primary transition-colors">Integración POS</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-5">Compañía</h4>
                    <ul className="space-y-3 text-sm text-on-surface-variant">
                        <li><Link href="#" className="hover:text-primary transition-colors">Sobre nosotros</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Casos de éxito</Link></li>
                        <li><Link href="#contact" className="hover:text-primary transition-colors">Contacto</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-5">Soporte</h4>
                    <ul className="space-y-3 text-sm text-on-surface-variant">
                        <li><Link href="#" className="hover:text-primary transition-colors">Centro de ayuda</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">API Docs</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Status</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Privacidad</Link></li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-on-surface-variant/70">
                    © 2026 Gastroflow Inc. Todos los derechos reservados.
                </p>
                <div className="flex items-center gap-6 opacity-40 grayscale contrast-0">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-5 w-auto object-contain" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-5 w-auto object-contain" />
                    <img src="https://seeklogo.com/images/T/transbank-logo-F38D9A2AFA-seeklogo.com.png" alt="Transbank" className="h-5 w-auto object-contain" />
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, features }: { icon: React.ReactNode, title: string, description: string, features: string[] }) {
    return (
        <Card className="p-6 border-none bg-surface-container-low hover:bg-surface-container transition-all hover:-translate-y-1 shadow-sm">
            <div className="w-12 h-12 rounded-[12px] bg-primary/10 text-primary flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">{title}</h3>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                {description}
            </p>
            <ul className="space-y-2">
                {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                        <CheckCircle2 size={14} className="text-primary/70" />
                        {f}
                    </li>
                ))}
            </ul>
        </Card>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="text-center">
            <p className="text-2xl font-black text-on-surface tracking-tight mb-1">{value}</p>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
        </div>
    );
}

function StepItem({ number, title, description }: { number: string, title: string, description: string }) {
    return (
        <div className="relative z-10 text-center">
            <div className="w-12 h-12 rounded-full gradient-primary text-on-primary-container flex items-center justify-center font-black mx-auto mb-6 shadow-lg">
                {number}
            </div>
            <h4 className="text-base font-bold mb-2">{title}</h4>
            <p className="text-sm text-on-surface-variant px-4 leading-relaxed">{description}</p>
        </div>
    );
}

function PricingFeature({ children, primary = false, disabled = false }: { children: React.ReactNode, primary?: boolean, disabled?: boolean }) {
    return (
        <li className={`flex items-center gap-3 text-sm ${disabled ? 'opacity-40' : 'opacity-100'}`}>
            <CheckCircle2 size={18} className={primary ? 'text-primary' : 'text-on-surface-variant'} />
            <span className={disabled ? 'line-through decoration-1' : 'font-medium'}>{children}</span>
        </li>
    );
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
    return (
        <Link href="#" className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all">
            {icon}
        </Link>
    );
}
