"use client";

import { useEffect, useRef } from "react";
import { Wasmboy } from "wasmboy";

export default function EmulatorViewer({ romBuffer }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!romBuffer || !canvasRef.current) return;

    const run = async () => {
      const wasmboy = await Wasmboy();

      wasmboy.config({
        canvasElement: canvasRef.current,
        audioEnabled: true,
        headless: false,
      });

      wasmboy.loadROM(romBuffer).then(() => {
        wasmboy.run();
      });
    };

    run();
  }, [romBuffer]);

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <canvas ref={canvasRef} className="w-full border rounded shadow" />
    </div>
  );
}
