"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { RocketIcon } from "lucide-react";

export default function SubmitButton() {
  const romBuffer = useAppStore((s) => s.romBuffer);
  const settings = useAppStore((s) => s.settings);
  const router = useRouter();

  const isReady =
    romBuffer !== null &&
    settings.difficulty &&
    typeof settings.weirdness === "number";

  const handleClick = () => {
    if (!isReady) return;
    router.push("/play");
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!isReady}
      className="w-full flex items-center justify-center gap-2 text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      <RocketIcon className="h-4 w-4" />
      Play
    </Button>
  );
}
