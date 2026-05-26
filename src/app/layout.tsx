import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura B2B | El Marketplace Mayorista Inteligente",
  description: "Conectamos empresas de distribución, vendedores freelance y tenderos locales en una plataforma ágil y transparente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
