"use client";

import { cn } from "@/lib/utils";
import { motion, type MotionValue, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface DockProps {
  className?: string;
  children: ReactNode;
  magnification?: number;
  distance?: number;
}

interface DockIconProps {
  className?: string;
  children?: ReactNode;
}

const DESKTOP = {
  magnification: 60,
  distance: 100,
  baseSize: 40,
  baseIconSize: 20,
} as const;

const MOBILE = {
  magnification: 38,
  distance: 0,
  baseSize: 38,
  baseIconSize: 20,
} as const;

const ICON_SIZE_RATIO = 0.5;
const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };

interface DockContextValue {
  mouseX: MotionValue<number>;
  magnification: number;
  distance: number;
  baseSize: number;
  baseIconSize: number;
  isCompact: boolean;
}

const DockContext = createContext<DockContextValue | null>(null);

function useCompactDock() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px), (pointer: coarse)");
    const update = () => setIsCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isCompact;
}

const Dock = ({
  className,
  children,
  magnification,
  distance,
}: DockProps) => {
  const mouseX = useMotionValue(Infinity);
  const isCompact = useCompactDock();
  const sizes = isCompact ? MOBILE : DESKTOP;
  const mag = magnification ?? sizes.magnification;
  const dist = distance ?? sizes.distance;

  return (
    <DockContext.Provider
      value={{
        mouseX,
        magnification: mag,
        distance: dist,
        baseSize: sizes.baseSize,
        baseIconSize: sizes.baseIconSize,
        isCompact,
      }}
    >
      <motion.div
        onMouseMove={(e) => {
          if (!isCompact) mouseX.set(e.pageX);
        }}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "mx-auto flex h-full max-w-full flex-nowrap items-end justify-start sm:justify-center rounded-full border",
          // overflow-x:auto forces overflow-y to clip too — only scroll on compact,
          // keep overflow visible on desktop so magnified icons float above the dock
          isCompact
            ? "overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            : "overflow-visible",
          className
        )}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
};

const DockIcon = ({ className, children }: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(DockContext);

  if (!context) {
    throw new Error("DockIcon must be used within a Dock component");
  }

  const { mouseX, magnification, distance, baseSize, baseIconSize, isCompact } =
    context;

  const distanceCalc = useTransform(mouseX, (val: number) => {
    if (isCompact) return Infinity;
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const containerSize = useSpring(
    useTransform(
      distanceCalc,
      [-distance, 0, distance],
      [baseSize, isCompact ? baseSize : magnification, baseSize]
    ),
    SPRING
  );
  const iconSize = useSpring(
    useTransform(
      distanceCalc,
      [-distance, 0, distance],
      [
        baseIconSize,
        isCompact ? baseIconSize : magnification * ICON_SIZE_RATIO,
        baseIconSize,
      ]
    ),
    SPRING
  );

  return (
    <motion.div
      ref={ref}
      style={{ width: containerSize, height: containerSize, minWidth: baseSize }}
      className={cn(
        "relative flex aspect-square shrink-0 items-center justify-center rounded-full",
        className
      )}
    >
      <motion.div
        style={{ width: iconSize, height: iconSize }}
        className="flex items-center justify-center"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export { Dock, DockIcon };
export type { DockProps, DockIconProps };
