"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Difficulty, useAppStore } from "@/lib/store"; // 👈 Zustand store

export default function ParameterForm() {
  const settings = useAppStore((s) => s.settings);
  const setSettings = useAppStore((s) => s.setSettings);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Label htmlFor="randomizeMoves">Randomize Move Sets</Label>
        <Switch
          id="randomizeMoves"
          checked={settings.randomizeMovesets}
          onCheckedChange={(checked) => setSettings({ randomizeMovesets: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="randomizeFoundItems">Randomize Found Items</Label>
        <Switch
          id="randomizeFoundItems"
          checked={settings.randomizeFoundItems}
          onCheckedChange={(checked) => setSettings({ randomizeFoundItems: checked })}
        />
      </div>

      <div className="flex items-center justify-between -mt-2 -mb-2">
        <Label htmlFor="difficulty">Difficulty Level</Label>
        <Select
          value={settings.difficulty}
          onValueChange={(value) => setSettings({ difficulty: value as Difficulty })}
        >
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

      <div className="flex items-center">
        <Label className="w-[400px]">Weirdness Level</Label>
        <Slider
          defaultValue={[settings.weirdness]}
          max={5}
          step={1}
          onValueChange={([val]) => setSettings({ weirdness: val })}
        />
      </div>
    </div>
  );
}
