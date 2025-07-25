import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { ArrowLeft, Archive } from "lucide-react";
import { useAccentColor } from "@/hooks/use-accent-color";
import ColumnVisibilitySettings from "@/components/ColumnVisibilitySettings";
import ColorPicker from "@/components/ColorPicker";

const Options = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { accentColor, updateAccentColor, resetAccentColor } = useAccentColor();



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

        <div className="mb-6">
          <Button
            onClick={() => navigate('/archive')}
            className="w-full sm:w-auto"
            variant="outline"
          >
            <Archive className="h-4 w-4 mr-2" />
            Архів
          </Button>
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

          <ColorPicker
            value={accentColor}
            onChange={updateAccentColor}
            onReset={resetAccentColor}
          />

          <ColumnVisibilitySettings />
        </div>
      </div>
    </div>
  );
};

export default Options;