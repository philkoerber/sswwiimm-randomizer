// in /play/page.tsx or .js
"use client";

import dynamic from "next/dynamic";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

// dynamically import GameBoyCanvas so it's only loaded client-side (so we can deploy on vercel)
const GameBoyCanvas = dynamic(() => import("@/components/emulator/GameBoyCanvas"), {
  ssr: false,
});

export default function PlayPage() {
  const rom = useAppStore((state) => state.romBuffer);

  if (!rom) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center p-6">
        <p className="text-muted-foreground">No ROM loaded.</p>
        <p>
          Please return to the{" "}
          <Link href="/" className="text-primary underline">
            main page
          </Link>{" "}
          and upload your ROM.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center  sm:h-screen sm:w-screen max-w-[1000px] max-h-[900px] border border-stone-200">
      <GameBoyCanvas rom={rom} />
    </div>
  );
}
