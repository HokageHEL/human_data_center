import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  onReset: () => void;
}

const PRESET_COLORS = [
  { name: "Зелений", value: "142 76% 36%" },
  { name: "Синій", value: "221 83% 53%" },
  { name: "Фіолетовий", value: "262 83% 58%" },
  { name: "Рожевий", value: "336 75% 40%" },
  { name: "Червоний", value: "0 84% 60%" },
  { name: "Помаранчевий", value: "35 100% 65%" },
  { name: "Жовтий", value: "48 96% 53%" },
  { name: "Бірюзовий", value: "173 58% 39%" },
  { name: "Індиго", value: "231 48% 48%" },
  { name: "Сірий", value: "215 14% 34%" },
];

const ColorPicker = ({ value, onChange, onReset }: ColorPickerProps) => {
  const [customColor, setCustomColor] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetSelect = (presetValue: string) => {
    onChange(presetValue);
    setCustomColor(presetValue);
    setIsOpen(false);
  };

  const handleCustomColorChange = (newColor: string) => {
    setCustomColor(newColor);
  };

  const handleCustomColorApply = () => {
    onChange(customColor);
    setIsOpen(false);
  };

  const parseHSL = (hslString: string) => {
    const parts = hslString.split(" ");
    if (parts.length === 3) {
      const h = parseInt(parts[0]);
      const s = parseInt(parts[1].replace("%", ""));
      const l = parseInt(parts[2].replace("%", ""));
      return { h, s, l };
    }
    return { h: 0, s: 0, l: 0 };
  };

  const formatHSL = (h: number, s: number, l: number) => {
    return `${h} ${s}% ${l}%`;
  };

  const hslToHex = (hslString: string) => {
    const { h, s, l } = parseHSL(hslString);
    const sDecimal = s / 100;
    const lDecimal = l / 100;

    const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lDecimal - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  const hexToHSL = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return formatHSL(
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(l * 100)
    );
  };

  const handleHexChange = (hex: string) => {
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      const hsl = hexToHSL(hex);
      setCustomColor(hsl);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="primary-color">Основний колір</Label>
      <div className="flex items-center gap-4">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <div
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: `hsl(${value})` }}
              />
              <span className="font-mono text-sm">{value}</span>
              <Palette className="w-4 h-4 ml-auto" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Готові кольори
                </Label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <Button
                      key={color.value}
                      variant="outline"
                      className={cn(
                        "h-10 w-full p-0 border-2",
                        value === color.value && "ring-2 ring-primary"
                      )}
                      style={{ backgroundColor: `hsl(${color.value})` }}
                      onClick={() => handlePresetSelect(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Власний колір</Label>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">HEX</Label>
                  <Input
                    type="color"
                    value={hslToHex(customColor)}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="h-10 w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">HSL</Label>
                  <Input
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    placeholder="142 76% 36%"
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCustomColorApply}
                    className="flex-1"
                    size="sm"
                  >
                    Застосувати
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div
          className="w-10 h-10 rounded-md border-2 border-border shrink-0"
          style={{ backgroundColor: `hsl(${value})` }}
        />

        <Button
          variant="outline"
          onClick={onReset}
          size="icon"
          className="shrink-0"
          title="Скинути до стандартного"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Виберіть колір з палітри або введіть власний у форматі HSL
      </p>
    </div>
  );
};

export default ColorPicker;
