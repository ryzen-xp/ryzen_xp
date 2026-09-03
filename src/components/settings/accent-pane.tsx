"use client";

import { useSettings } from "@/store/use-settings";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

const ACCENT_COLORS = [
    { id: "blue", name: "Default Blue", hex: "hsl(250, 70%, 50%)" },
    { id: "purple", name: "Royal Purple", hex: "hsl(300, 70%, 50%)" },
    { id: "green", name: "Emerald", hex: "hsl(150, 70%, 40%)" },
    { id: "orange", name: "Sunset", hex: "hsl(45, 90%, 50%)" },
    { id: "pink", name: "Rose", hex: "hsl(340, 80%, 60%)" },
    { id: "black", name: "Monochrome", hex: "hsl(0, 0%, 15%)" }
] as const;

export function AccentPane() {
    const { accentColor, setAccentColor } = useSettings();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <section className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 fill-mode-both">
            <div>
                <h3 className="text-lg font-semibold">Accent Color</h3>
                <p className="text-sm text-muted-foreground">Personalize the primary color globally.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2 p-6 rounded-2xl border border-border bg-card">
                {ACCENT_COLORS.map((color) => {
                    const isActive = accentColor === color.id;
                    return (
                        <button
                            key={color.id}
                            onClick={() => setAccentColor(color.id as any)}
                            aria-label={`Set accent color to ${color.name}`}
                            title={color.name}
                            className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/20 ${isActive ? "ring-2 ring-offset-2 ring-offset-background ring-foreground shadow-lg scale-110" : "shadow-sm hover:shadow-md"}`}
                            style={{ backgroundColor: color.hex }}
                        >
                            {isActive && (
                                <Check className="w-5 h-5 text-white drop-shadow-md animate-in zoom-in duration-200" />
                            )}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
