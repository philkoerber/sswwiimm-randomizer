"use client";

import GameBoyCanvas from "@/components/emulator/GameBoyCanvas";
import { useAppStore } from "@/lib/store";
import dynamic from "next/dynamic";



export default function PlayPage() {
  const rom = useAppStore((state) => state.romBuffer);

  if (!rom) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center p-6">
        <p className="text-muted-foreground">No ROM loaded.</p>
        <p>
          Please return to the{" "}
          <a href="/" className="text-primary underline">
            main page
          </a>{" "}
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
