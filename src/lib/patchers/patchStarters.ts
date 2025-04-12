export function patchStarters(rom: Uint8Array): void {
    // Based on disassembly, starter Pokémon IDs are stored at 0x2F24
    rom[0x2F24] = 0x15; // Starter 1 (Bulbasaur -> MissingNo)
    rom[0x2F25] = 0x15; // Starter 2 (Charmander -> MissingNo)
    rom[0x2F26] = 0x15; // Starter 3 (Squirtle -> MissingNo)
  }
  