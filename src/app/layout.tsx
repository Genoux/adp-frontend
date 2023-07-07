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
    <html lang="en">
      <body className={`${inter.className} container`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
