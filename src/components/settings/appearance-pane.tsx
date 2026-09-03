"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function AppearancePane() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const options = [
        { id: "light", label: "Light", icon: <Sun className="w-5 h-5" /> },
        { id: "dark", label: "Dark", icon: <Moon className="w-5 h-5" /> },
        { id: "system", label: "System", icon: <Monitor className="w-5 h-5" /> },
    ];

    return (
        <section className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
                <h3 className="text-lg font-semibold">Appearance</h3>
                <p className="text-sm text-muted-foreground">Customize the theme of the portfolio.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-2">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-300 ${
                            theme === option.id 
                            ? "border-primary bg-primary/5 text-primary shadow-sm" 
                            : "border-border bg-card text-muted-foreground hover:bg-muted hover:border-primary/50"
                        }`}
                    >
                        {option.icon}
                        <span className="font-medium text-sm">{option.label}</span>
                    </button>
                ))}
            </div>
        </section>
    );
}
