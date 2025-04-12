"use client";

import { Button } from "../button";
import { CoffeeIcon } from "lucide-react";

export default function SupportButton() {
  const handleClick = () => {
    window.open("https://ko-fi.com/sswwiimmtv", "_blank");
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 text-lg font-medium transition-all"
    >
      <CoffeeIcon className="h-4 w-4" />
      Pay me a Coffee!
    </Button>
  );
}