import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script, Sora } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./CartProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Restaurant Delice Wand",
  description: "Découvrez notre menu et réservez une table facilement.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Restaurant Delice Wand",
    description: "Découvrez notre menu et réservez une table facilement.",
    url: "https://ton-domaine.com",
    siteName: "Restaurant Delice Wand",
    images: [
      {
        url: "/favicon.ico", // tu peux mettre un PNG ou JPG plus grand si tu veux un visuel net
        width: 64,
        height: 64,
        alt: "Logo Restaurant Delice Wand",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Restaurant Delice Wand",
    description: "Découvrez notre menu et réservez une table facilement.",
    images: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} ${sora.variable} antialiased`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
