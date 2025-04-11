"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { DownloadIcon } from "lucide-react";

export default function DownloadButton() {
  const romBuffer = useAppStore((s) => s.romBuffer);

  const handleDownload = () => {
    if (!romBuffer) return;

    // Create a blob from the romBuffer and generate a URL
    const blob = new Blob([romBuffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);

    // Create an anchor element and trigger a download
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sswwiimmRandomized.gb"; // Change the file name as desired
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Clean up the URL object
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
