"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { DownloadIcon } from "lucide-react";
import { editRom } from "@/lib/editRom"; // 👈 import the reusable patcher

export default function DownloadButton() {
  const romBuffer = useAppStore((s) => s.romBuffer);
  const settings = useAppStore((s) => s.settings);

  const handleDownload = () => {
    if (!romBuffer) return;

    // Patch the ROM using current settings
    const editedRom = editRom(romBuffer, settings);

    // Create a blob from the edited ROM and generate a URL
    const blob = new Blob([editedRom], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);

    // Trigger a download
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sswwiimmRandomized.gb";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Revoke blob URL
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={!romBuffer}
      className="w-full flex items-center justify-center gap-2 text-lg font-medium transition-all"
    >
      <DownloadIcon className="h-4 w-4" />
      Download
    </Button>
  );
}
