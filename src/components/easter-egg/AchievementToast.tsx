"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { hasAchievement } from "@/utils/achievements";

export function AchievementToast() {
    useEffect(() => {
        // Add a small delay so it doesn't fire instantly before the page settles
        const timer = setTimeout(() => {
            if (hasAchievement()) {
                toast.success("Welcome back, Persistent Hacker 👋", {
                    duration: 3000,
                    icon: "🏆",
                });
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return null; // This is a logic-only component
}
