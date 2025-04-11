import type { Metadata } from "next";
import { Onest, DotGothic16 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Image from "next/image";

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
        {/* 👾 MissingNo bottom-right */}
        <div className="fixed bottom-0 right-0 hidden md:block -z-40">
          <Image
            src="/MissingNo.png"
            alt="MissingNo"
            width={64}
            height={64}
            // className="drop-shadow-lg animate-bounce" // optional fun
          />
        </div>
      </body>
    </html>
  );
}
