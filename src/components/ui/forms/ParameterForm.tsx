"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";

export default function ParameterForm() {
  const [randomizeMoves, setRandomizeMoves] = useState(true);
  const [randomizeFoundItems, setRandomizeFoundItems] = useState(true);
  const [difficulty, setDifficulty] = useState("normal");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="randomizeMoves">Randomize Move Sets</Label>
        <Switch
          id="randomizeMoves"
          checked={randomizeMoves}
          onCheckedChange={setRandomizeMoves}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="randomizeFoundItems">Randomize Found Items</Label>
        <Switch
          id="randomizeFoundItems"
          checked={randomizeFoundItems}
          onCheckedChange={setRandomizeFoundItems}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="difficulty">Difficulty Level</Label>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
            <SelectItem value="insane">Insane</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Weirdness Level</Label>
        <Slider defaultValue={[3]} max={5} step={1} />
      </div>
    </div>
  );
}
