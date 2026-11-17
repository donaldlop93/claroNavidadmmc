import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://claro-navidad-mmc.vercel.app'),
  title: 'El Reto Navideño Claro 2026 — M&M Comunicaciones S.A.',
  description:
    'Portal de consulta de avance de metas TAE y SIM Cards para Puntos de Venta (PDR) en Zona Norte. Distribuidor Autorizado M&M Comunicaciones S.A.',
  applicationName: 'Reto Navideño Claro 2026',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Reto Claro 2026',
  },
  icons: {
    icon: '/logos/claro-logo.png',
    apple: '/logos/claro-logo.png',
  },
  openGraph: {
    title: 'El Reto Navideño Claro 2026 — Zona Norte',
    description: 'Consultá tu avance de metas TAE y SIM Cards. ¡Cumplí el 100% y participá en el sorteo!',
    type: 'website',
    images: [{ url: '/logos/claro-logo.png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#DA291C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 selection:bg-red-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
