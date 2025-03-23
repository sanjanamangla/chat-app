import { Moon, Sun, Laptop } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useThemeStore } from "@/store/themeStore";
import { Theme } from "@/types";
import { useThemeEffect } from "@/hooks/useThemeEffect";

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();
  useThemeEffect(theme);

  const options: { value: Theme; label: string; icon: JSX.Element }[] = [
    { value: "light", label: "Light", icon: <Sun size={16} className="mr-2" /> },
    { value: "dark", label: "Dark", icon: <Moon size={16} className="mr-2" /> },
    { value: "system", label: "System", icon: <Laptop size={16} className="mr-2" /> },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-full p-2 hover:bg-muted transition-colors">
          {options.find((option) => option.value === theme)?.icon}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="end">
        <div className="space-y-0.5">
          {options.map(({ value, label, icon }) => (
            <button
              key={value}
              className={`w-full flex items-center px-2 py-1.5 text-sm rounded-md transition-colors hover:bg-muted ${theme === value ? "bg-muted" : ""}`}
              onClick={() => setTheme(value)}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeToggle;
