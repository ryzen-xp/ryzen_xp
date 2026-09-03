"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/store/use-settings";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { DotPattern } from "@/components/magicui/dot-pattern";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const { accentColor, backgroundType } = useSettings();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        document.documentElement.setAttribute("data-theme", accentColor);
    }, [accentColor, mounted]);

    // Render nothing for the background until mounted to avoid hydration mismatch
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <>
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {backgroundType === "grid" && (
                    <div className="absolute inset-x-0 top-0 h-[300px]">
                        <FlickeringGrid
                            className="h-full w-full"
                            squareSize={2}
                            gridGap={2}
                            style={{
                                maskImage: "linear-gradient(to bottom, black, transparent)",
                                WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
                            }}
                        />
                    </div>
                )}
                {backgroundType === "dots" && (
                    <DotPattern
                        className="opacity-50"
                        style={{
                            maskImage: "radial-gradient(ellipse at top, black, transparent)",
                            WebkitMaskImage: "radial-gradient(ellipse at top, black, transparent)",
                        }}
                    />
                )}
                {backgroundType === "gradient" && (
                    <div className="absolute inset-0 opacity-20 dark:opacity-10 bg-gradient-to-br from-primary via-transparent to-transparent mix-blend-screen" />
                )}
            </div>
            
            <div className="relative z-10">
                {children}
            </div>
        </>
    );
}
