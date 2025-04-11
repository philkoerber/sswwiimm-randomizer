"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";
import { useAppStore } from "@/lib/store"; // 👈 Zustand store

export default function UploadRomForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setRom = useAppStore((state) => state.setRom); // 👈 Zustand action

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError("");
    setLoading(true);

    file
      .arrayBuffer()
      .then((buffer) => {
        const uint8Rom = new Uint8Array(buffer);
        setRom(uint8Rom); // 👈 Store it globally
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
      className={`group relative w-full max-w-md mx-auto p-6 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition hover:border-primary/70 cursor-pointer ${
        isDragActive ? "border-primary" : "border-muted"
      }`}
    >
      <input {...getInputProps()} />

      <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary mb-2" />

      <p className="text-center text-sm text-muted-foreground">
        {isDragActive
          ? "Drop your ROM here"
          : "Drag & drop your Pokémon Red ROM, or click to browse"}
      </p>

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
