import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/app/components/ui/theme-provider";

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
      <body className={`${GeistSans.className} mx-auto h-full px-6 min-w-[1024px] max-w-[1440px]`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
