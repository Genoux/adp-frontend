import "./globals.css";
import { Bai_Jamjuree } from "next/font/google";
import { ThemeProvider } from "@/app/components/ui/theme-provider";
import { ImageProvider } from '@/app/context/ImageContext';  // Import the ImageProvider

const bai_jamjuree = Bai_Jamjuree({
  subsets: ["latin-ext"],
  weight: "500"
})

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
      <body className={`${bai_jamjuree.className} min-w-[1024px] mx-auto overflow-hidden`}>
        <ImageProvider> {/* Wrap children with ImageProvider */}
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </ImageProvider>
      </body>
    </html>
  );
}
