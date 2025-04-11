"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";
import { useAppStore } from "@/lib/store"; // Zustand store (for ROM only)

export default function UploadRomForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filename, setFilename] = useState<string | null>(null); // 👈 store locally

  const setRom = useAppStore((state) => state.setRom); // only store the ROM globally

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError("");
    setLoading(true);

    file
      .arrayBuffer()
      .then((buffer) => {
        const uint8Rom = new Uint8Array(buffer);
        setRom(uint8Rom);
        setFilename(file.name); // 👈 store the name locally
      })
      .catch(() => setError("Something went wrong while reading the ROM."))
      .finally(() => setLoading(false));
  }, [setRom]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/octet-stream": [".gb"] },
    multiple: false,
  });

  return (
    <Card
      {...getRootProps()}
      className={`group relative w-full  mx-auto p-6 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition hover:border-primary/70 cursor-pointer ${
        isDragActive ? "border-primary" : "border-muted"
      }`}
    >
      <input {...getInputProps()} />

      <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary mb-2" />

<div className="w-[250px]"><p className="text-center text-sm text-muted-foreground">
        {filename
          ? `${filename}`
          : isDragActive
          ? "Drop your ROM here"
          : "Drag & drop your Pokémon Red ROM, or click to browse"}
      </p></div>
      

      <Button type="button" className="mt-4" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Browse Files"
        )}
      </Button>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </Card>
  );
}
