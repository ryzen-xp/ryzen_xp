import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AccentColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'black';
type BackgroundType = 'grid' | 'dots' | 'gradient' | 'none';

interface SettingsState {
    accentColor: AccentColor;
    backgroundType: BackgroundType;
    setAccentColor: (color: AccentColor) => void;
    setBackgroundType: (type: BackgroundType) => void;
}

export const useSettings = create<SettingsState>()(
    persist(
        (set) => ({
            accentColor: 'black',
            backgroundType: 'grid',
            setAccentColor: (color) => set({ accentColor: color }),
            setBackgroundType: (type) => set({ backgroundType: type }),
        }),
        {
            name: 'portfolio-settings',
        }
    )
);
