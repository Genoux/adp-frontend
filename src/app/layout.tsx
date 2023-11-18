import "./globals.css";
import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from "@/app/components/ui/theme-provider";
import { ImageProvider } from '@/app/context/ImageContext';  // Import the ImageProvider

export const metadata = {
  title: "HAQ - Aram draft pick",
  description: "Aram draft pick for League of Legends",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${GeistSans.className} min-w-[1024px] mx-auto overflow-hidden`}>
        <ImageProvider> {/* Wrap children with ImageProvider */}
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </ImageProvider>
       <div className="flex absolute  w-full justify-end bottom-0 items-center pb-2 pr-4 font-medium text-sm">Beta 0.2.0</div>
      </body>
    </html>
  );
}
