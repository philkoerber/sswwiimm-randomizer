// lib/editRom.ts

import { RandomizerSettings } from "@/lib/store";

// This function receives the original ROM and randomizer settings, and returns a modified ROM
export function editRom(originalRom: Uint8Array, settings: RandomizerSettings): Uint8Array {
  const rom = new Uint8Array(originalRom); // Clone to avoid mutating the original

  // === EXAMPLE PATCH LOCATIONS ===
  // These are dummy byte offsets — you'd replace these with actual offsets relevant to your ROM hack.

  // 0x150: Difficulty
  const difficultyByteMap: Record<RandomizerSettings["difficulty"], number> = {
    easy: 0x01,
    normal: 0x02,
    hard: 0x03,
    insane: 0x04,
  };
  rom[0x150] = difficultyByteMap[settings.difficulty];

  // 0x151: Weirdness level (0–255)
  rom[0x151] = Math.min(Math.max(settings.weirdness, 0), 255);

  // 0x152: Randomize movesets flag
  rom[0x152] = settings.randomizeMovesets ? 0x01 : 0x00;

  // 0x153: Randomize found items flag
  rom[0x153] = settings.randomizeFoundItems ? 0x01 : 0x00;

  // Optionally: set a patch marker so we know this ROM has been edited
  rom[0x14F] = 0x42; // Example: set some byte to indicate this is a custom build

  return rom;
}
