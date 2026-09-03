export const ACHIEVEMENT_KEY = "persistent_hacker_unlocked";

export function unlockAchievement() {
    if (typeof window !== 'undefined') {
        localStorage.setItem(ACHIEVEMENT_KEY, "true");
    }
}

export function hasAchievement() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(ACHIEVEMENT_KEY) === "true";
    }
    return false;
}
