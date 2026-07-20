import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISBEN | El Marketplace Mayorista B2B/B2C",
  description: "Conectamos empresas de distribución, vendedores freelance y tenderos locales en una plataforma ágil y transparente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
