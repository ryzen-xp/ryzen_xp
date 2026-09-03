"use client";

import { BookOpen, Users, Star, GitFork } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";

export function OpenSourceStats({ user, repos, events }: { user: any, repos: any[], events: any[] }) {
    const { totalStars, totalForks } = useMemo(() => {
        let stars = 0;
        let forks = 0;
        repos.forEach(r => {
            stars += r.stargazers_count || 0;
            forks += r.forks_count || 0;
        });
        return { totalStars: stars, totalForks: forks };
    }, [repos]);

    const stats = [
        { label: "Public Repos", value: user?.public_repos || 0, icon: <BookOpen className="w-4 h-4 text-blue-500" /> },
        { label: "Total Stars", value: totalStars, icon: <Star className="w-4 h-4 text-amber-500" /> },
        { label: "Total Forks", value: totalForks, icon: <GitFork className="w-4 h-4 text-emerald-500" /> },
        { label: "Followers", value: user?.followers || 0, icon: <Users className="w-4 h-4 text-purple-500" /> },
    ];

    return (
        <section className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-card"
                >
                    <div className="flex items-center gap-2 text-muted-foreground">
                        {stat.icon}
                        <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                </motion.div>
            ))}
        </section>
    );
}
