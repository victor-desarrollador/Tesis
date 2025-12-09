import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tienda L&V | Cosmética, Accesorios y Carteras",
  description:
    "Compra cosmética, accesorios y carteras en Tienda L&V. Ofertas exclusivas y envíos a toda Argentina.",
  keywords: [
    "tienda online",
    "cosmética",
    "accesorios",
    "carteras",
    "regalos",
    "L&V",
  ],
  authors: [{ name: "Tienda L&V" }],
  openGraph: {
    title: "Tienda L&V | Comprá cosmética, accesorios y carteras",
    description:
      "Tienda L&V: productos exclusivos, ofertas y envíos a todo el país.",
    type: "website",
    locale: "es_AR",
    url: "http://localhost:3000", // Cambialo cuando tengas el dominio
    siteName: "Tienda L&V",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased`}>
        {/* Header */}
        {children}
        {/* Footer */}
      </body>
    </html>
  );
}
