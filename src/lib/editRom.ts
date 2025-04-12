// lib/editRom.ts

import { RandomizerSettings } from "@/lib/store";
import { patchStarters } from "./patchers/patchStarters";

// This function receives the original ROM and randomizer settings, and returns a modified ROM
export function editRom(originalRom: Uint8Array, settings: RandomizerSettings): Uint8Array {
  const rom = new Uint8Array(originalRom); // Clone to avoid mutating the original

  console.log(settings)
  console.log(rom[0x2F24])

  patchStarters(rom)

  return rom;
}
