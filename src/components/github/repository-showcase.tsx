"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Star, GitFork, ArrowUpRight, Code2 } from "lucide-react";

type RepoStatus = "Building" | "Stable" | "Archived" | "Experimental";

// Helper to determine mock status based on updated_at or topics
const getStatus = (repo: any): RepoStatus => {
    if (repo.archived) return "Archived";
    const daysSinceUpdate = (new Date().getTime() - new Date(repo.updated_at).getTime()) / (1000 * 3600 * 24);
    if (daysSinceUpdate < 30) return "Building";
    if (repo.topics?.includes("experimental")) return "Experimental";
    return "Stable";
};

const getStatusColor = (status: RepoStatus) => {
    switch (status) {
        case "Building": return "bg-blue-500/15 text-blue-600 dark:text-blue-400";
        case "Stable": return "bg-green-500/15 text-green-600 dark:text-green-400";
        case "Experimental": return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
        case "Archived": return "bg-gray-500/15 text-gray-600 dark:text-gray-400";
    }
};

export function RepositoryShowcase({ repos }: { repos: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"All" | RepoStatus>("All");

    const filteredRepos = useMemo(() => {
        return repos.filter((repo) => {
            const status = getStatus(repo);
            const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                 (repo.language && repo.language.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesTab = activeTab === "All" || status === activeTab;
            
            return matchesSearch && matchesTab;
        }).slice(0, 12); // Limit to top 12
    }, [repos, searchQuery, activeTab]);

    return (
        <section id="showcase" className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight">Repository Showcase</h2>
                <p className="text-muted-foreground">Explore my open-source work, filtered in real-time.</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search repositories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {["All", "Building", "Stable", "Experimental", "Archived"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                activeTab === tab 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredRepos.map((repo) => {
                        const status = getStatus(repo);
                        return (
                            <motion.a
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                key={repo.id}
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex flex-col justify-between gap-4 p-5 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="flex flex-col gap-3 relative z-10">
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                                            {repo.name}
                                        </h3>
                                        <div className={`px-2 py-0.5 rounded-sm text-[10px] font-medium shrink-0 flex items-center gap-1 ${getStatusColor(status)}`}>
                                            {status === "Building" && (
                                              <span className="relative flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                                              </span>
                                            )}
                                            {status}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                        {repo.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 relative z-10">
                                    <div className="flex items-center gap-4">
                                        {repo.language && (
                                            <span className="flex items-center gap-1.5">
                                                <Code2 className="w-3.5 h-3.5" />
                                                {repo.language}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1.5">
                                            <Star className="w-3.5 h-3.5" />
                                            {repo.stargazers_count}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <GitFork className="w-3.5 h-3.5" />
                                            {repo.forks_count}
                                        </span>
                                    </div>
                                    <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </span>
                                </div>
                                
                                {/* Hover Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </motion.a>
                        );
                    })}
                </AnimatePresence>
                
                {filteredRepos.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground text-sm">
                        No repositories found matching your criteria.
                    </div>
                )}
            </motion.div>
        </section>
    );
}
