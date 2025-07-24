import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <span></span>
        <div className="flex items-center gap-2 font-bold text-xl">
          <img
            src="/wasp-logo.png"
            alt="WASP Logo"
            className="h-8 w-8 object-contain"
          />
          ОСА
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/options")}
          className="relative h-9 w-9 transition-colors hover:bg-accent/20 dark:hover:bg-accent/10"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Open settings</span>
        </Button>
      </div>
    </header>
  );
}
