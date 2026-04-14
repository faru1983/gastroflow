import type { Metadata, Viewport } from "next";
import { Inter, Roboto, Playfair_Display, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: "Gastroflow — Todo tu restaurante en una sola plataforma",
    template: "%s | Gastroflow",
  },
  description:
    "Carta digital QR, reservas online, fidelización y analítica. La plataforma SaaS todo-en-uno para restaurantes en Chile.",
  keywords: [
    "restaurante",
    "carta digital",
    "QR",
    "reservas",
    "fidelización",
    "SaaS",
    "Chile",
  ],
  authors: [{ name: "Gastroflow" }],
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Gastroflow",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0F1413",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${roboto.variable} ${playfair.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-sans">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--surface-container)",
              color: "var(--on-surface)",
              border: "1px solid var(--outline-variant)",
              borderRadius: "8px",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
