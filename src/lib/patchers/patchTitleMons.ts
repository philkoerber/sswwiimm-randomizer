//see title_mons.asm
//and 01:4588 TitleMons in pokered.sym

export function patchTitleMons(rom: Uint8Array): void {
    const titleMonsOffset = 0x4588;
    const ids = [0x83, 0x15]; // Scyther, Pikachu, Snorlax, Gengar, Weedle

    for (let i = 0; i < 16; i++) {
        rom[titleMonsOffset + i] = ids[i % ids.length];
    }
}