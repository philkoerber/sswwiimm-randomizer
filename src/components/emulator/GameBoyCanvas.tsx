"use client";

import { useEffect, useRef } from "react";

// You'll need to set this up properly from your emulator's docs
export default function GameBoyCanvas({ rom }: { rom: Uint8Array }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const runEmulator = async () => {
      const { Wasmboy } = await import("wasmboy"); // or your emulator
      await Wasmboy.config({
        canvasElement: canvasRef.current,
        headless: false,
        audioBatchProcessing: true,
      });

      await Wasmboy.loadROM(rom);
      Wasmboy.play();
    };

    runEmulator();
  }, [rom]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={144}
      className="w-[320px] h-[288px] border shadow-lg"
    />
  );
}
