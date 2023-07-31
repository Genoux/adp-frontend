import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/app/components/ui/theme-provider";
const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} container p-0 border border-green-600 h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
