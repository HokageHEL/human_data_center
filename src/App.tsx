import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";
import { Footer } from "@/components/ui/footer";
import Home from "./pages/Home";
import EditPerson from "./pages/EditPerson";
import NotFound from "./pages/NotFound";
import Options from "./pages/Options";
import { useEffect } from "react";

// Initialize accent color from localStorage
const initializeAccentColor = () => {
  const savedColor = localStorage.getItem("primary-color");
  if (savedColor) {
    const root = document.documentElement;
    root.style.setProperty("--primary", savedColor);
    root.style.setProperty("--ring", savedColor);
    root.style.setProperty("--accent", savedColor.replace(/\d+%$/, "75%"));
  }
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeAccentColor();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" attribute="class" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/edit/:name" element={<EditPerson />} />
              <Route path="/options" element={<Options />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
