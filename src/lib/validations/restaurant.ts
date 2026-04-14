import { z } from "zod";

export const restaurantSettingsSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().max(300, "La descripción no puede exceder los 300 caracteres").optional().nullable(),
  address: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  contact_email: z.string().email("Email inválido").optional().nullable().or(z.literal("")),
  website: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  instagram_url: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  facebook_url: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  tiktok_url: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  whatsapp_number: z.string().optional().nullable(),
  google_maps_review_url: z.string().url("URL inválida").optional().nullable().or(z.literal("")),
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color hex inválido").optional().nullable(),
});

export type RestaurantSettingsData = z.infer<typeof restaurantSettingsSchema>;
