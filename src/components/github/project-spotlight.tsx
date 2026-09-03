"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Github, Star, GitFork, ArrowUpRight, Code2 } from "lucide-react";
import Link from "next/link";

export function ProjectSpotlight({ repos }: { repos: any[] }) {
    const [featured, setFeatured] = useState<any>(null);

    useEffect(() => {
        const fallback = {
            name: "Trustless-OSS",
            description: "GitHub-integrated bounty platform that auto-releases USDC rewards via Trustless Work escrow on pull-request merge.",
            language: "TypeScript",
            stargazers_count: 0,
            forks_count: 0,
            html_url: "https://github.com/Trustless-OSS/Trustless-OSS",
            homepage: "https://www.trustless-oss.xyz"
        };

        if (repos && repos.length > 0) {
            const targetRepo = repos.find(r => r.name.toLowerCase() === "trustless-oss");
            setFeatured(targetRepo || fallback);
        } else {
            setFeatured(fallback);
        }
    }, [repos]);

    if (!featured) return null;

    return (
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
            
            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                            Project Spotlight
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            {featured.name}
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-xl text-balance">
                            {featured.description || "An ongoing exploration in software engineering."}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
                        {featured.language && (
                            <span className="flex items-center gap-2">
                                <Code2 className="w-4 h-4" />
                                {featured.language}
                            </span>
                        )}
                        <span className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            {featured.stargazers_count}
                        </span>
                        <span className="flex items-center gap-2">
                            <GitFork className="w-4 h-4" />
                            {featured.forks_count}
                        </span>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                        <a
                            href={featured.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            View Repository
                        </a>
                        <a
                            href={featured.homepage || featured.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-background hover:bg-muted transition-colors font-medium"
                        >
                            Live Demo
                            <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Decorative Graphic Side */}
                <div className="hidden md:flex flex-1 items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full" />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full max-w-sm aspect-video rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-2xl flex items-center justify-center overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                        <Code2 className="w-16 h-16 text-muted-foreground/30 group-hover:text-primary/50 transition-colors duration-500" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
