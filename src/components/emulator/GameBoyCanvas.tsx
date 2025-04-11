"use client";

import { useEffect, useRef } from "react";
import { WasmBoy } from "wasmboy";

export default function GameBoyCanvas({ rom }: { rom: Uint8Array }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  return (
    <div>
      <canvas
        ref={canvasRef}
        width={160}
        height={144}
        className="w-[320px] h-[288px] border shadow-lg"
      />
    </div>
  );
}
