import './globals.css';
import { ThemeProvider } from '@/app/components/ui/theme-provider';
import { GeistSans } from 'geist/font/sans';
import Image from 'next/image';

export const metadata = {
  title: 'HAQ - Aram draft pick',
  description: 'Aram draft pick for League of Legends',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/images/favicon-light.ico',
        href: '/images/favicon-light.ico',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/images/favicon-dark.ico',
        href: '/images/favicon-dark.ico',
      },
    ],
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
        className={`${GeistSans.className} mx-auto h-full min-w-[1024px] max-w-[1440px]`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Image
            className="fixed left-0 top-0 -z-10 h-full w-full opacity-50"
            src="/bg-fog.png"
            alt="HAQ"
            width={1440}
            height={200}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
