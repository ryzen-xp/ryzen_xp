"use client";

import { useSettings } from "@/store/use-settings";
import { Grid, HelpCircle, Layers, Paintbrush } from "lucide-react";
import { useEffect, useState } from "react";

const BACKGROUNDS = [
    { id: "grid", label: "Flickering Grid", description: "A dynamic tech-inspired grid.", icon: <Grid className="w-5 h-5" /> },
    { id: "dots", label: "Subtle Dots", description: "Clean, minimalist dot pattern.", icon: <HelpCircle className="w-5 h-5" /> },
    { id: "gradient", label: "Animated Gradient", description: "Smooth, premium mesh gradient.", icon: <Paintbrush className="w-5 h-5" /> },
    { id: "none", label: "None", description: "Pure whitespace for zero distraction.", icon: <Layers className="w-5 h-5" /> },
] as const;

export function BackgroundPane() {
    const { backgroundType, setBackgroundType } = useSettings();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <section className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">
            <div>
                <h3 className="text-lg font-semibold">Background Animation</h3>
                <p className="text-sm text-muted-foreground">Select the global background style.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {BACKGROUNDS.map((bg) => (
                    <button
                        key={bg.id}
                        onClick={() => setBackgroundType(bg.id as any)}
                        className={`flex flex-col text-left gap-2 p-5 rounded-2xl border transition-all duration-300 ${
                            backgroundType === bg.id 
                            ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary" 
                            : "border-border bg-card hover:bg-muted hover:border-primary/50"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${backgroundType === bg.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                                {bg.icon}
                            </div>
                            <span className="font-semibold">{bg.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            {bg.description}
                        </p>
                    </button>
                ))}
            </div>
        </section>
    );
}
