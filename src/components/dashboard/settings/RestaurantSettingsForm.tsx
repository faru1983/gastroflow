"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Input,
  Textarea,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Select
} from "@/components/ui";
import { ImageUploader } from "@/components/ui/ImageUploader";
import {
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Settings,
  Star,
  Home,
  Clock,
  Palette,
  Type,
  Square,
  Moon,
  Layout
} from "lucide-react";
import { toast } from "sonner";
import { updateRestaurant, type Restaurant } from "@/services/restaurant";
import { useRouter } from "next/navigation";

interface RestaurantSettingsFormProps {
  restaurant: Restaurant;
}

const DAYS = [
  { key: "lunes", label: "Lunes" },
  { key: "martes", label: "Martes" },
  { key: "miercoles", label: "Miércoles" },
  { key: "jueves", label: "Jueves" },
  { key: "viernes", label: "Viernes" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
] as const;

interface DaySchedule {
  enabled: boolean;
  open: string;
  close: string;
}

function parseOpeningHours(raw: Record<string, string> | null): Record<string, DaySchedule> {
  const result: Record<string, DaySchedule> = {};
  for (const day of DAYS) {
    const value = raw?.[day.key];
    if (value) {
      const parts = value.split(" - ");
      result[day.key] = {
        enabled: true,
        open: parts[0]?.trim() || "12:00",
        close: parts[1]?.trim() || "22:00",
      };
    } else {
      result[day.key] = { enabled: false, open: "12:00", close: "22:00" };
    }
  }
  return result;
}

function parseThemeConfig(raw: any): ThemeConfig {
  const defaults: ThemeConfig = {
    border_radius: "8px",
    font_family: "Inter",
    button_style: "solid",
    show_footer_name: true,
    default_mode: "dark",
    accent_color: "#FFB95F"
  };

  if (!raw) return defaults;
  return { ...defaults, ...raw };
}

function serializeOpeningHours(schedule: Record<string, DaySchedule>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(schedule)) {
    if (value.enabled) {
      result[key] = `${value.open} - ${value.close}`;
    }
  }
  return result;
}

interface ThemeConfig {
  [key: string]: string | boolean | undefined;
  border_radius: string;
  font_family: string;
  button_style: string;
  show_footer_name: boolean;
  default_mode: string;
  accent_color: string;
}

export function RestaurantSettingsForm({ restaurant }: RestaurantSettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: restaurant.name || "",
    description: restaurant.description || "",
    address: restaurant.address || "",
    contact_phone: restaurant.contact_phone || "",
    contact_email: restaurant.contact_email || "",
    website: restaurant.website || "",
    instagram_url: restaurant.instagram_url || "",
    facebook_url: restaurant.facebook_url || "",
    tiktok_url: restaurant.tiktok_url || "",
    whatsapp_number: restaurant.whatsapp_number || "",
    google_maps_review_url: restaurant.google_maps_review_url || "",
    google_rating: restaurant.google_rating?.toString() || "0",
    primary_color: restaurant.primary_color || "#29A195",
    logo_url: restaurant.logo_url || "",
    banner_url: restaurant.banner_url || "",
    theme_config: parseThemeConfig(restaurant.theme_config),
  });

  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(
    parseOpeningHours(restaurant.opening_hours as Record<string, string> | null)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleToggle = (dayKey: string) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], enabled: !prev[dayKey].enabled },
    }));
  };

  const handleScheduleChange = (dayKey: string, field: "open" | "close", value: string) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateRestaurant(restaurant.id, {
        name: formData.name,
        description: formData.description || null,
        address: formData.address || null,
        contact_phone: formData.contact_phone || null,
        contact_email: formData.contact_email || null,
        website: formData.website || null,
        instagram_url: formData.instagram_url || null,
        facebook_url: formData.facebook_url || null,
        tiktok_url: formData.tiktok_url || null,
        whatsapp_number: formData.whatsapp_number || null,
        google_maps_review_url: formData.google_maps_review_url || null,
        google_rating: parseFloat(formData.google_rating) || 0,
        primary_color: formData.primary_color || null,
        logo_url: formData.logo_url || null,
        banner_url: formData.banner_url || null,
        theme_config: formData.theme_config,
        opening_hours: serializeOpeningHours(schedule),
      });
      toast.success("Configuración guardada con éxito");
      router.refresh();
    } catch (saveError: any) {
      console.error("[RestaurantSettingsForm] Error al guardar:", {
        error: saveError,
        message: saveError.message,
        details: saveError.details,
        hint: saveError.hint
      });
      toast.error(`Error al guardar: ${saveError.message || "Verifica los datos"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-full overflow-x-hidden">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Home size={14} /> Básicos
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <Clock size={14} /> Horarios
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Globe size={14} /> Contacto
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <MessageSquare size={14} /> Redes
          </TabsTrigger>
          <TabsTrigger value="google" className="flex items-center gap-2">
            <Star size={14} /> Google
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Settings size={14} /> Apariencia
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: BÁSICOS                               */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="basic" className="space-y-4 px-0 sm:px-0">
          <Card className="p-4 sm:p-6 space-y-5">
            <Input
              label="Nombre del Restaurante"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Gastro Bistro"
              required
            />
            <Textarea
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe lo mejor de tu restaurante..."
              hint="Se mostrará en la parte superior del Portal del Cliente."
            />
          </Card>

          <Card className="p-4 sm:p-6 space-y-5">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              Imágenes del Restaurante
            </h3>
            <p className="text-xs text-on-surface-variant -mt-3">
              Las imágenes se optimizan automáticamente al subirlas (WebP, máx 5 MB).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="w-full max-w-[180px]">
                <ImageUploader
                  label="Logo"
                  currentUrl={formData.logo_url || null}
                  type="logo"
                  aspectRatio="aspect-square"
                  onUploadComplete={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                  onRemove={() => setFormData(prev => ({ ...prev, logo_url: "" }))}
                />
              </div>
              <div className="w-full max-w-full sm:max-w-[320px]">
                <ImageUploader
                  label="Banner / Portada"
                  currentUrl={formData.banner_url || null}
                  type="banner"
                  aspectRatio="aspect-video"
                  onUploadComplete={(url) => setFormData(prev => ({ ...prev, banner_url: url }))}
                  onRemove={() => setFormData(prev => ({ ...prev, banner_url: "" }))}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: HORARIOS                              */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="hours" className="space-y-4 px-0 sm:px-0 max-w-full overflow-hidden">
          <Card className="p-4 sm:p-6 space-y-1 max-w-full overflow-hidden">
            <h3 className="text-sm font-bold text-on-surface mb-1">Horarios de Atención</h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Activa los días que tu restaurante está abierto y configura el horario.
            </p>
            <div className="space-y-2 sm:space-y-3 w-full">
              {DAYS.map(({ key, label }) => {
                const day = schedule[key];
                return (
                  <div
                    key={key}
                    className={`flex flex-col sm:flex-row sm:items-center gap-4 p-3 sm:p-4 rounded-[12px] transition-colors w-full overflow-hidden ${
                      day.enabled ? "bg-surface-container-low" : "bg-surface-container-high/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-5 shrink-0">
                      {/* Toggle */}
                      <button
                        type="button"
                        onClick={() => handleScheduleToggle(key)}
                        className={`
                          w-11 h-6 rounded-full relative transition-all duration-200 outline-none flex-none
                          ${day.enabled ? "bg-primary shadow-[0_0_10px_rgba(107,216,203,0.3)]" : "bg-outline-variant/50"}
                        `}
                      >
                        <span
                          className={`
                            absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200
                            ${day.enabled ? "translate-x-5" : "translate-x-0"}
                          `}
                        />
                      </button>

                      {/* Day Name */}
                      <span className="text-sm font-semibold text-on-surface w-20 shrink-0">
                        {label}
                      </span>
                    </div>

                    {/* Time Inputs */}
                    {day.enabled ? (
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full sm:w-auto">
                        <input
                          type="time"
                          value={day.open}
                          onChange={(e) => handleScheduleChange(key, "open", e.target.value)}
                          className="h-10 px-2 sm:px-3 rounded-[8px] bg-surface-container text-sm text-on-surface outline-none border border-outline-variant/30 focus:border-primary/50 tabular-nums flex-1 sm:flex-none sm:w-32"
                        />
                        <span className="text-xs text-outline shrink-0">—</span>
                        <input
                          type="time"
                          value={day.close}
                          onChange={(e) => handleScheduleChange(key, "close", e.target.value)}
                          className="h-10 px-2 sm:px-3 rounded-[8px] bg-surface-container text-sm text-on-surface outline-none border border-outline-variant/30 focus:border-primary/50 tabular-nums flex-1 sm:flex-none sm:w-32"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-outline italic">Cerrado</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: CONTACTO                              */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="contact" className="space-y-4 px-0 sm:px-0">
          <Card className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Email de Contacto"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="contacto@restaurante.com"
                leftIcon={<Mail size={16} />}
              />
              <Input
                label="Teléfono de Contacto"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="+569..."
                leftIcon={<Phone size={16} />}
              />
            </div>
            <Input
              label="Dirección"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej: Av. Providencia 1234, Santiago"
              leftIcon={<MapPin size={16} />}
            />
            <Input
              label="Sitio Web"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.tu-restaurante.com"
              leftIcon={<Globe size={16} />}
            />
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: REDES                                 */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="social" className="space-y-4 px-0 sm:px-0">
          <Card className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="WhatsApp"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                placeholder="+569..."
                leftIcon={<MessageSquare size={16} />}
              />
              <Input
                label="Instagram URL"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/tu_perfil"
                leftIcon={<Globe size={16} />}
              />
              <Input
                label="Facebook URL"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleChange}
                placeholder="https://facebook.com/tu_pagina"
                leftIcon={<Globe size={16} />}
              />
              <Input
                label="TikTok URL"
                name="tiktok_url"
                value={formData.tiktok_url}
                onChange={handleChange}
                placeholder="https://tiktok.com/@tu_perfil"
                leftIcon={<Globe size={16} />}
              />
            </div>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: GOOGLE                                */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="google" className="space-y-4 px-0 sm:px-0">
          <Card className="p-4 sm:p-6 space-y-4">
            <div className="p-3 bg-tertiary/5 border border-tertiary/10 rounded-[10px] text-xs text-on-surface-variant italic">
              Esta información se utiliza para mostrar tu calificación estelar en el Portal del Cliente.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Input
                label="Calificación (0-5)"
                name="google_rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.google_rating}
                onChange={handleChange}
                leftIcon={<Star size={16} className="text-tertiary" />}
              />
              <div className="md:col-span-3">
                <Input
                  label="URL para dejar Reseña"
                  name="google_maps_review_url"
                  value={formData.google_maps_review_url}
                  onChange={handleChange}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: APARIENCIA                            */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="appearance" className="space-y-4 px-0 sm:px-0">
          <Card className="p-4 sm:p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <Palette size={16} className="text-primary" /> Colores del Portal
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 mb-4">
                Define la paleta principal de tu marca en la plataforma.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                    <div className="flex-1">
                      <Input
                        label="Color Primario"
                        name="primary_color"
                        value={formData.primary_color}
                        onChange={handleChange}
                        placeholder="#29A195"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={formData.primary_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                        className="w-12 h-12 rounded-[12px] border border-outline-variant cursor-pointer bg-transparent p-0.5"
                      />
                      <div
                        className="w-12 h-12 rounded-[12px] shadow-inner border border-outline-variant/30 shrink-0"
                        style={{ backgroundColor: formData.primary_color }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                    <div className="flex-1">
                      <Input
                        label="Color de Acento"
                        value={formData.theme_config.accent_color}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          theme_config: { ...prev.theme_config, accent_color: e.target.value } 
                        }))}
                        placeholder="#FFB95F"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={formData.theme_config.accent_color}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          theme_config: { ...prev.theme_config, accent_color: e.target.value } 
                        }))}
                        className="w-12 h-12 rounded-[12px] border border-outline-variant cursor-pointer bg-transparent p-0.5"
                      />
                      <div
                        className="w-12 h-12 rounded-[12px] shadow-inner border border-outline-variant/30 shrink-0"
                        style={{ backgroundColor: formData.theme_config.accent_color }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-outline-variant/30" />

            <div>
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <Layout size={16} className="text-primary" /> Estilo y Forma
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 mb-4">
                Personaliza la estructura visual de tus componentes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <Select
                  label="Tipo de Esquinas"
                  leftIcon={<Square size={16} />}
                  value={formData.theme_config.border_radius}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    theme_config: { ...prev.theme_config, border_radius: e.target.value } 
                  }))}
                  options={[
                    { label: "Rectas (Sharp)", value: "0px" },
                    { label: "Suaves (Default)", value: "8px" },
                    { label: "Redondeadas", value: "16px" },
                    { label: "Circulares (Max)", value: "99px" },
                  ]}
                />
                <Select
                  label="Tipografía"
                  leftIcon={<Type size={16} />}
                  value={formData.theme_config.font_family}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    theme_config: { ...prev.theme_config, font_family: e.target.value } 
                  }))}
                  options={[
                    { label: "Modern Sans (Inter)", value: "Inter" },
                    { label: "Classic Sans (Roboto)", value: "Roboto" },
                    { label: "Elegant (Playfair)", value: "Playfair Display" },
                    { label: "Geometric (Montserrat)", value: "Montserrat" },
                  ]}
                />
                <Select
                  label="Estilo de Botones"
                  leftIcon={<Palette size={16} />}
                  value={formData.theme_config.button_style}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    theme_config: { ...prev.theme_config, button_style: e.target.value } 
                  }))}
                  options={[
                    { label: "Sólido", value: "solid" },
                    { label: "Gradiente", value: "gradient" },
                    { label: "Borde (Outline)", value: "outline" },
                    { label: "Cristal (Glass)", value: "glass" },
                  ]}
                />
              </div>
            </div>

            <div className="h-[1px] bg-outline-variant/30" />

            <div>
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <Moon size={16} className="text-primary" /> Preferencias de Visualización
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 mb-4">
                Configura cómo se verá el portal por defecto.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select
                  label="Modo por Defecto"
                  leftIcon={<Moon size={16} />}
                  value={formData.theme_config.default_mode}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    theme_config: { ...prev.theme_config, default_mode: e.target.value } 
                  }))}
                  options={[
                    { label: "Modo Oscuro (Recomendado)", value: "dark" },
                    { label: "Modo Claro", value: "light" },
                  ]}
                />
                <div className="flex items-center gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      theme_config: { ...prev.theme_config, show_footer_name: !prev.theme_config.show_footer_name } 
                    }))}
                    className={`
                      w-11 h-6 rounded-full relative transition-all duration-200 flex-none
                      ${formData.theme_config.show_footer_name ? "bg-primary shadow-[0_0_10px_rgba(107,216,203,0.3)]" : "bg-outline-variant/30"}
                    `}
                  >
                    <span
                      className={`
                        absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200
                        ${formData.theme_config.show_footer_name ? "translate-x-5" : "translate-x-0"}
                      `}
                    />
                  </button>
                  <span className="text-xs font-medium text-on-surface">Mostrar nombre en el Footer</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 pb-12">
        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full sm:w-auto px-8 shadow-lg shadow-primary/20 h-12 sm:h-10"
        >
          <Save size={18} className="mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
