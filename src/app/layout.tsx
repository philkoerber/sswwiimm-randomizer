import type { Metadata } from "next";
import { Onest, DotGothic16 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const dotGothic16 = DotGothic16({
  weight: "400", // required!
  variable: "--font-dotGothic16",
  subsets: ["latin"],
});

const onest = Onest({
  weight: "400",
  variable: "--font-onest",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sswwiimm RANDOMIZER",
  description: "The weirdest Pokémon Red Randomizers that you have ever seen",
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
        {children}
      </body>
    </html>
  );
}
