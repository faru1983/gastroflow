import { getRestaurantBySlug } from "@/services/restaurant";
import { notFound } from "next/navigation";
import { type ReactNode } from "react";

interface RestaurantLayoutProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

/**
 * Mapa de font_family (valor guardado en BD) → variable CSS de next/font/google.
 * Las variables están definidas en el root layout.
 */
const FONT_CSS_VAR: Record<string, string> = {
  "Inter": "var(--font-inter)",
  "Roboto": "var(--font-roboto)",
  "Playfair Display": "var(--font-playfair)",
  "Montserrat": "var(--font-montserrat)",
};

export default async function RestaurantLayout({ params, children }: RestaurantLayoutProps) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  // Parsear theme config con defaults seguros
  const theme = (restaurant.theme_config as Record<string, unknown>) || {};
  const borderRadius = (theme.border_radius as string) || "8px";
  const fontFamily = (theme.font_family as string) || "Inter";
  const accentColor = (theme.accent_color as string) || "#FFB95F";
  const mode = (theme.default_mode as string) || "dark";

  // Construir las CSS custom properties para el portal.
  // IMPORTANTE: NO inyectar --primary aquí como inline style porque
  // [data-theme="light"] ya define el --primary correcto y el inline
  // style tiene mayor especificidad, lo sobreescribiría siempre.
  const cssVars: Record<string, string> = {
    "--tertiary": accentColor,
    fontFamily: `${FONT_CSS_VAR[fontFamily] || FONT_CSS_VAR["Inter"]}, ui-sans-serif, system-ui, sans-serif`,
  };

  // Solo inyectar --primary si el restaurante definió uno explícitamente.
  // Si es null/vacío, dejar que [data-theme] decida el color correcto.
  if (restaurant.primary_color) {
    cssVars["--primary"] = restaurant.primary_color;
  }

  return (
    <div
      className="min-h-screen bg-surface text-on-surface"
      data-theme={mode}
      style={cssVars as React.CSSProperties}
    >
      {children}
    </div>
  );
}
