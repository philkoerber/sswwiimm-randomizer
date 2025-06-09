import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a banked address (e.g. 01:4588) into a flat ROM file offset.
 *
 * @param bank - Bank number as number (e.g. 1 for bank 01)
 * @param address - Address within the bank (e.g. 0x4588)
 * @returns ROM file offset (as a number)
 */
export function getROMOffset(bank: number, address: number): number {
  if (bank === 0) {
    return address; // Bank 0 is fixed from 0x0000
  }
  if (address < 0x4000 || address >= 0x8000) {
    throw new Error(
      `Invalid address ${address.toString(16)} for switchable bank ${bank}. Must be in 0x4000–0x7FFF.`
    );
  }

  return bank * 0x4000 + (address - 0x4000);
}