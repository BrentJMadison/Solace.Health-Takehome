import type { Metadata } from "next";
import { Lato } from "next/font/google";
import ThemeRegistry from '@/components/ThemeRegistry';
import "./globals.css";

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Solace Advocates Directory",
  description: "Search, filter, and connect with mental health advocates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
