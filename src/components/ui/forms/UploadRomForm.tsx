"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";

export default function UploadRomForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("rom", file);

    fetch("/api/randomize", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to process ROM");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "randomized.gb";
        a.click();
      })
      .catch(() => setError("Something went wrong while randomizing the ROM."))
      .finally(() => setLoading(false));
  }, []);

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
            Randomizing...
          </>
        ) : (
          "Browse Files"
        )}
      </Button>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </Card>
  );
}
