// src/lib/patchers/patchStarters.ts

export function patchStarters(rom: Uint8Array): void {

  //SPRITES WHEN POKEMON IS SELECTED
  //........

  //POKEMON THEMSELVES
  const starter1Offset = 0x169E; // Starter 1
  const starter2Offset = 0x16A0; // Starter 2
  const starter3Offset = 0x16A2; // Starter 3

  rom[starter1Offset] = 0x32; // MissingNo
  rom[starter2Offset] = 0x32; // MissingNo
  rom[starter3Offset] = 0x32; // MissingNo
}