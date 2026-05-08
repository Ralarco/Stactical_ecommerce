import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Stactical — Unyielding',
    template: '%s | Stactical',
  },
  description: 'Engineered for extremes. Stripped of excess. The pinnacle of achromatic utility.',
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-surface text-ink-black font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
