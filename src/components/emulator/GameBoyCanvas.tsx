"use client";

import React, { useEffect, useRef } from "react";
import { WasmBoy } from "wasmboy";

interface GameBoyCanvasProps {
  rom: Uint8Array;
}

const GameBoyCanvas: React.FC<GameBoyCanvasProps> = ({ rom }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // This ref lets us track if WasmBoy was already configured.
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!rom) return; // Guard if rom is not available
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setupEmulator = async () => {
      try {
        // First time, configure WasmBoy with desired options.
        if (!isInitialized.current) {
          const options = {
            headless: false,
            useGbcWhenOptional: true,
            isAudioEnabled: true,
            frameSkip: 1,
            audioBatchProcessing: true,
            timersBatchProcessing: false,
            audioAccumulateSamples: true,
            graphicsBatchProcessing: false,
            graphicsDisableScanlineRendering: false,
            tileRendering: true,
            tileCaching: true,
            gameboyFPSCap: 30,
            updateGraphicsCallback: false,
            updateAudioCallback: false,
            saveStateCallback: false,
            // You can also add callbacks such as onReady, onPlay, etc.
          };

          // Configure WasmBoy to use this canvas as its output target.
          await WasmBoy.config(options, canvas);
          isInitialized.current = true;
        } else {
          // If WasmBoy is already configured, you might want to reset before loading a new rom.
          // The reset method pauses the emulator, so you'll need to load the new ROM and play again.
          await WasmBoy.reset();
        }

        // Load the provided ROM (the rom prop passed from your store).
        await WasmBoy.loadROM(rom);
        // Begin or resume playing the loaded ROM.
        await WasmBoy.play();
        console.log("WasmBoy is running!");
      } catch (error) {
        console.error("Error setting up WasmBoy:", error);
      }
    };

    setupEmulator();

    // Cleanup: pause the emulator when the component unmounts.
    return () => {
      WasmBoy.pause().catch((err: ErrorEvent) =>
        console.error("Error pausing WasmBoy:", err)
      );
    };
  }, [rom]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full border border-gray-300"
      // Optionally, set a fixed size or aspect ratio if needed.
      width="100%"
      height="100%"
    />
  );
};

export default GameBoyCanvas;
