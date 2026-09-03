"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

export function CodingDNA({ repos }: { repos: any[] }) {
    const { total, languages } = useMemo(() => {
        const langMap: Record<string, number> = {};
        let totalCount = 0;

        repos.forEach((repo) => {
            if (repo.language) {
                langMap[repo.language] = (langMap[repo.language] || 0) + 1;
                totalCount++;
            }
        });

        const sorted = Object.entries(langMap)
            .sort((a, b) => b[1] - a[1]);

        const top5 = sorted.slice(0, 5);
        const remaining = sorted.slice(5);
        
        let finalLanguages = [...top5];

        if (remaining.length > 0) {
            const otherCount = remaining.reduce((acc, curr) => acc + curr[1], 0);
            finalLanguages.push(["Other", otherCount]);
        }

        return { total: totalCount, languages: finalLanguages };
    }, [repos]);

    if (!languages.length) return null;

    return (
        <section className="flex flex-col gap-8 p-8 border border-border rounded-2xl bg-card">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold tracking-tight">Coding DNA</h2>
                <p className="text-sm text-muted-foreground">Language distribution across my public repositories.</p>
            </div>

            <div className="flex flex-col gap-6">
                {languages.map(([lang, count], index) => {
                    const percentage = Math.round((count / total) * 100);
                    
                    // Generate a deterministic color based on the language name
                    let hash = 0;
                    for (let i = 0; i < lang.length; i++) {
                        hash = lang.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    const hue = Math.abs(hash % 360);
                    
                    return (
                        <div key={lang} className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span>{lang}</span>
                                <span className="text-muted-foreground">{percentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${percentage}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: `hsl(${hue}, 70%, 50%)` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
