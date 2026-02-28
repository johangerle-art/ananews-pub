import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ananews.pub – Anarkistisk global morgonöversikt",
  description:
    "Maktkritisk nyhetsöversikt inspirerad av Joseph Toscano. Motstånd, övervakning, klimat, ekonomi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] antialiased">
        {children}
      </body>
    </html>
  );
}
