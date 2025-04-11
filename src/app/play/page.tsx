"use client";

import { useAppStore } from "@/lib/store";
import dynamic from "next/dynamic";

// Assuming you have a wrapper like <GameBoyCanvas rom={rom} />
const GameBoyCanvas = dynamic(() => import("@/components/emulator/GameBoyCanvas"), {
  ssr: false,
});

export default function PlayPage() {
  const rom = useAppStore((state) => state.romBuffer);

  if (!rom) {
    return (
      <main className="flex flex-col gap-4 items-center justify-center min-h-screen p-6">
        <p className="text-muted-foreground">No ROM loaded.</p>
        <p>
          Please return to the{" "}
          <a href="/" className="text-primary underline">
            main page
          </a>{" "}
          and upload your ROM.
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <GameBoyCanvas rom={rom} />
    </main>
  );
}
