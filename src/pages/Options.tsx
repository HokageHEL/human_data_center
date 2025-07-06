import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { ArrowLeft } from "lucide-react";
import { useAccentColor } from "@/hooks/use-accent-color";

const Options = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { accentColor, updateAccentColor, resetAccentColor } = useAccentColor();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAccentColor(e.target.value);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Налаштування</h1>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Тема</Label>
            <div className="flex items-center gap-4">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
              >
                Світла
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
              >
                Темна
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => setTheme("system")}
              >
                Системна
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary-color">Основний колір</Label>
            <div className="flex items-center gap-4">
              <Input
                id="primary-color"
                type="text"
                value={accentColor}
                onChange={handleColorChange}
                placeholder="35 100% 65%"
                className="font-mono"
              />
              <div
                className="w-10 h-10 rounded-md border"
                style={{ backgroundColor: `hsl(${accentColor})` }}
              />
              <Button
                variant="outline"
                onClick={resetAccentColor}
                size="sm"
              >
                Скинути
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Формат: відтінок насиченість яскравість (HSL)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;