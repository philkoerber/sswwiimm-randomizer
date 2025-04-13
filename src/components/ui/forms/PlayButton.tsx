"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { RocketIcon } from "lucide-react";
import { editRom } from "@/lib/editRom"; // import it



export default function PlayButton() {
  const romBuffer = useAppStore((s) => s.romBuffer);
  const settings = useAppStore((s) => s.settings);
  const setRom = useAppStore((s) => s.setRom); // 👈 update the store

  const router = useRouter();

  const isReady =
  romBuffer !== null &&
  settings.difficulty &&
  typeof settings.weirdness === "number";

const handleClick = () => {
  if (!isReady || !romBuffer) return;

  const editedRom = editRom(romBuffer, settings);

  setRom(editedRom);
  router.push("/play");
};

  return (
    <Button
      onClick={handleClick}
      disabled={!isReady}
      className="w-full flex items-center justify-center gap-2 text-lg font-medium transition-all"
    >
      <RocketIcon className="h-4 w-4" />
      Play
    </Button>
  );
}
