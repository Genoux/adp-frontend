import './globals.css';
import { ThemeProvider } from '@/app/components/ui/theme-provider';
import { ImageProvider } from '@/app/context/ImageContext'; // Import the ImageProvider
import { GeistSans } from 'geist/font/sans';

export const metadata = {
  title: 'HAQ - Aram draft pick',
  description: 'Aram draft pick for League of Legends',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} mx-auto min-w-[1024px] overflow-hidden`}
      >
        <ImageProvider>
          {' '}
          {/* Wrap children with ImageProvider */}
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </ImageProvider>
        <div className="absolute bottom-0  flex w-full items-center justify-end pb-2 pr-4 text-sm font-medium">
          Beta 0.2.0
        </div>
      </body>
    </html>
  );
}
