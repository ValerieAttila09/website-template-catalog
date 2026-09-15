import type { Metadata } from "next";
import { Geist_Mono, League_Spartan, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["700", "800"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UPLIFT | Lift your brand higher",
  description: "Premium website templates to lift your brand higher.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistMono.variable, "font-sans", poppins.variable, leagueSpartan.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
