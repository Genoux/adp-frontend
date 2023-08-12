import "./globals.css";
import { Bai_Jamjuree  } from "next/font/google";
import { ThemeProvider } from "@/app/components/ui/theme-provider";
const inter = Bai_Jamjuree({
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
      <body className={`${inter.className} container pb-6 overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
