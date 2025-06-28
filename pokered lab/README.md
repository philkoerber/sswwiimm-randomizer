# Pokémon Red Disassembly (Research Directory)

This directory contains the **pret/pokered** disassembly of Pokémon Red and Blue for research purposes only.

## 📋 Purpose

The Pokémon Red disassembly is included in this project for:
- **Research and Analysis**: Understanding the game's internal structure
- **ROM Patching**: Creating patches for the randomizer functionality
- **Data Extraction**: Accessing Pokémon stats, moves, and game mechanics
- **Educational Purposes**: Learning about GameBoy assembly and game development

## 🏗️ What's Included

This is a complete disassembly of Pokémon Red and Blue that builds the following ROMs:

- **Pokemon Red (UE) [S][!].gb** `sha1: ea9bcae617fdf159b045185467ae58b2e4a48b9a`
- **Pokemon Blue (UE) [S][!].gb** `sha1: d7037c83e1ae5b39bde3c30787637ba1d4c48ce2`
- **BLUEMONS.GB** (debug build) `sha1: 5b1456177671b79b263c614ea0e7cc9ac542e9c4`
- **dmgapae0.e69.patch** `sha1: 0fb5f743696adfe1dbb2e062111f08f9bc5a293a`
- **dmgapee0.e68.patch** `sha1: ed4be94dc29c64271942c87f2157bca9ca1019c7`

## 📁 Directory Structure

```
pokered lab/pokered/
├── audio/              # Music and sound effects
├── constants/          # Game constants and definitions
├── data/              # Game data (Pokémon, moves, items, etc.)
├── engine/            # Game engine code
├── gfx/               # Graphics and sprites
├── home/              # Core system functions
├── maps/              # Map data and scripts
├── ram/               # Memory layout definitions
├── scripts/           # Map scripts
├── text/              # Text data
└── tools/             # Build tools
```

## 🔧 Key Files for Randomizer

### Pokémon Data
- `data/pokemon/base_stats/` - Base stats for all Pokémon
- `data/pokemon/dex_entries.asm` - Pokédex entries
- `data/pokemon/cries.asm` - Pokémon cry data

### Move Data
- `data/moves/` - Move definitions and effects
- `data/moves/effects_pointers.asm` - Move effect pointers
- `data/moves/animations.asm` - Move animations

### Item Data
- `data/items/` - Item definitions and effects
- `data/items/marts.asm` - Shop inventories

### Map Data
- `data/maps/` - Map layouts and connections
- `data/maps/objects/` - Map object placements
- `scripts/` - Map interaction scripts

## 🚫 Important Notice

**This disassembly is for research purposes only and is not used in the main application.**

The SSWWIIMM Randomizer:
- Does NOT include or distribute any ROM files
- Does NOT use this disassembly for commercial purposes
- Uses this data purely for educational and research purposes
- Creates patches that users apply to their own legally obtained ROMs

## 🙏 Acknowledgments

This disassembly is the incredible work of the **pret** team:

- **Original Repository**: [pret/pokered](https://github.com/pret/pokered)
- **Team**: The pret team and contributors
- **License**: This disassembly is provided under the same license as the original project

### Useful Links
- [pret Wiki](https://github.com/pret/pokered/wiki)
- [pret Discord](https://discord.gg/d5dubZ3)
- [pret Tools](https://pret.github.io/)

## 🔍 How It's Used

In the SSWWIIMM Randomizer project, this disassembly helps us:

1. **Understand Game Structure**: Learn how Pokémon data is organized
2. **Create Patches**: Generate patches for randomizer modifications
3. **Extract Data**: Access move types, base stats, and other game data
4. **Validate Changes**: Ensure our modifications are compatible

## 📄 License

This disassembly is included under the same license as the original pret/pokered project. Please refer to the original repository for licensing information.

---

**Thank you to the pret team for making this incredible disassembly available to the community!** 