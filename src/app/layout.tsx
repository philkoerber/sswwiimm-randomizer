import type { Metadata } from "next";
import { Onest, DotGothic16 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Link from "next/link";

const dotGothic16 = DotGothic16({
  weight: "400", // required!
  variable: "--font-dotGothic16",
  subsets: ["latin"],
});

const onest = Onest({
  weight: "300",
  variable: "--font-onest",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sswwiimm RANDOMIZER",
  description: "The weirdest Pokémon Red Randomizer that you have ever seen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`${dotGothic16.variable} ${onest.variable} antialiased`}
      >
        <Header />
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          {children}
        </div>

        {/* Hidden test page link - only visible on hover */}
        <div className="fixed bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Link
            href="/test"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
            style={{ fontFamily: "var(--font-onest)" }}
          >
            🧪 test
          </Link>
        </div>
      </body>
    </html>
  );
}
