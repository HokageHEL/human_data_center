import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./ui/logo";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSettingsClick = () => {
    // Check if we're on the edit page and if there are unsaved changes
    if (location.pathname.startsWith("/edit/")) {
      // Dispatch a custom event to check for unsaved changes
      const event = new CustomEvent("checkUnsavedChanges", {
        detail: { targetPath: "/options" },
      });
      window.dispatchEvent(event);
    } else {
      navigate("/options");
    }
  };

  const handleLogoClick = () => {
    // Check if we're on the edit page and if there are unsaved changes
    if (location.pathname.startsWith("/edit/")) {
      // Dispatch a custom event to check for unsaved changes
      const event = new CustomEvent("checkUnsavedChanges", {
        detail: { targetPath: "/" },
      });
      window.dispatchEvent(event);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <span></span>
        <div 
          className="flex items-center gap-2 font-bold text-xl cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        >
          <Logo className="h-10 w-10" />
          ОСА
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSettingsClick}
          className="relative h-9 w-9 transition-colors hover:bg-accent/30 dark:hover:bg-accent/20"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Open settings</span>
        </Button>
      </div>
    </header>
  );
}
