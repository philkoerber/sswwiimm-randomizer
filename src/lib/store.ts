import { create } from "zustand";

export type Difficulty = "easy" | "normal" | "hard" | "insane";

export interface RandomizerSettings {
  randomizeMovesets: boolean;
  randomizeFoundItems: boolean;
  difficulty: Difficulty;
  weirdness: number;
}

interface AppState {
  romBuffer: Uint8Array | null;
  settings: RandomizerSettings;
  setRom: (buffer: Uint8Array) => void;
  setSettings: (settings: Partial<RandomizerSettings>) => void;
  isVoiceChatHotkeySet: boolean;
  setVoiceChatHotkeySet: (isSet: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  romBuffer: null,
  settings: {
    randomizeMovesets: true,
    randomizeFoundItems: true,
    difficulty: "normal",
    weirdness: 3,
  },
  setRom: (romBuffer) => set({ romBuffer }),
  setSettings: (partialSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...partialSettings },
    })),
  isVoiceChatHotkeySet: false,
  setVoiceChatHotkeySet: (isSet) => set({ isVoiceChatHotkeySet: isSet }),
}));
