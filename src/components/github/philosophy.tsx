"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const statements = [
    "I build products that solve real problems.",
    "Every repository represents a learning milestone.",
    "I value clean architecture over quick hacks.",
    "Engineering is the art of balancing perfection and pragmatism.",
    "Code is read more often than it is written."
];

export function Philosophy() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % statements.length);
        }, 4000); // Change statement every 4 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-20 flex flex-col items-center justify-center text-center px-4">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8">
                Development Philosophy
            </span>
            <div className="h-32 flex items-center justify-center w-full max-w-4xl">
                <AnimatePresence mode="wait">
                    <motion.h3
                        key={index}
                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground text-balance"
                    >
                        &quot;{statements[index]}&quot;
                    </motion.h3>
                </AnimatePresence>
            </div>
        </section>
    );
}
