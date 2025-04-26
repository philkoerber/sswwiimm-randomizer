// lib/editRom.ts

import { RandomizerSettings } from "@/lib/store";
import { patchStarters } from "./patchers/patchStarters";

const isRomModified = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) return true;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return true;
  }
  return false;
};

// This function receives the original ROM and randomizer settings, and returns a modified ROM
export function editRom(originalRom: Uint8Array, settings: RandomizerSettings): Uint8Array {
  const rom = new Uint8Array(originalRom); // Clone to avoid mutating the original

  patchStarters(rom)

  console.log(
    settings,
    "Before:",
    originalRom.slice(0x46ADD, 0x46ADD + 3),
    "After:",
    rom.slice(0x46ADD, 0x46ADD + 3)
  );

  const isDifferent = isRomModified(rom, originalRom);
  if (!isDifferent) {
    console.error("The ROM was not modified. Are the patch settings correct?");
  }

  console.log("")

  return rom;
}
