export function patchStarters(rom: Uint8Array): void {
  const starterOffsets = [0x46ADD, 0x46F97, 0x494B7, 0x74F9B];
  for (const offset of starterOffsets) {
    rom[offset] = 0x15;
    rom[offset + 1] = 0x15;
    rom[offset + 2] = 0x15;
  }
}