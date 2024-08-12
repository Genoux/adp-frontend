import './globals.css';
import { ThemeProvider } from '@/app/components/ui/theme-provider';
import { Toaster } from '@/app/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistSans } from 'geist/font/sans';

export const metadata = {
  title: 'HAQ - Aram draft pick',
  description: 'Aram draft pick for League of Legends ARAM mode',
  icons: {
    icon: [
      {
        url: 'https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/favicon.png',
        href: 'https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/favicon.png',
      },
    ],
  },
  openGraph: {
    images:
      'https://sdedknsmucuwsvgfxrxs.supabase.co/storage/v1/object/public/Assets/opengraph-image.jpg',
    siteName: 'HAQ - Aram draft pick',
    url: 'https://draft.tournoishaq.ca/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} mx-auto min-w-[1024px] overflow-x-hidden bg-zinc-950`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
