
import React from "react";
import { useTheme } from "../providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="theme-toggle"
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        className={cn(
          "theme-toggle-switch",
          isDarkMode ? "bg-[#1A1A1A]" : "bg-[#F4F4F4]",
          "w-[62px] h-[30px] transition-colors duration-250 ease-in-out"
        )}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        <div className={cn(
          "flex justify-center items-center w-[26px] h-[26px] rounded-full transition-transform duration-250 ease-in-out",
          isDarkMode ? 
            "translate-x-[32px] bg-[#60A5FA] text-white" :
            "translate-x-0 bg-[#FACC15] text-white"
        )}>
          {isDarkMode ? (
            <Moon className="h-4 w-4 transition-opacity" />
          ) : (
            <Sun className="h-4 w-4 transition-opacity" />
          )}
        </div>
      </Switch>
      <span className="sr-only md:not-sr-only text-sm">
        {isDarkMode ? "Dark" : "Light"} Mode
      </span>
    </div>
  );
}
