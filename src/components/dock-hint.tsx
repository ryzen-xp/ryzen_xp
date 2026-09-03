"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export function DockHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("dock-hint-seen");
    if (!seen) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        localStorage.setItem("dock-hint-seen", "1");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => {
        setVisible(false);
        localStorage.setItem("dock-hint-seen", "1");
      }}
      className="pointer-events-auto flex flex-col items-center gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-500 cursor-pointer"
    >
      <span className="text-[10px] font-medium text-muted-foreground/70 tracking-wide bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50 select-none">
        hover icons to navigate
      </span>
      <ChevronDown className="size-3.5 text-muted-foreground/50 animate-bounce" />
    </button>
  );
}
