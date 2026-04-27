import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Streck för streck – Hanzi-träning HSK 1-3",
  description:
    "Mobil app för att träna kinesiska tecken i rätt streckordning med pinyin, betydelse och pedagogiska stödtexter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        {children}
      </body>
    </html>
  );
}
