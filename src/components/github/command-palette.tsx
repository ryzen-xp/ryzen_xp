"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Home, FileText, Search, Activity, Github, Terminal, ArrowRight } from "lucide-react";

export function GithubCommandPalette({ repos }: { repos: any[] }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
        >
            <Command
                label="Global Command Menu"
                className="w-full max-w-xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Escape") setOpen(false);
                }}
            >
                <div className="flex items-center border-b border-border px-3">
                    <Search className="w-4 h-4 text-muted-foreground mr-2" />
                    <Command.Input
                        autoFocus
                        placeholder="Type a command or search..."
                        className="w-full h-12 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                    />
                    <kbd className="hidden sm:inline-flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono text-muted-foreground ml-2">
                        ESC
                    </kbd>
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                    <Command.Empty className="p-6 text-center text-sm text-muted-foreground">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 py-1">
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/"))}
                            className="flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer text-sm text-foreground hover:bg-muted aria-selected:bg-muted transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Go to Home
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/research"))}
                            className="flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer text-sm text-foreground hover:bg-muted aria-selected:bg-muted transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Read Research Logs
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => window.open("https://github.com/ryzen-xp", "_blank"))}
                            className="flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer text-sm text-foreground hover:bg-muted aria-selected:bg-muted transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            Open GitHub Profile
                            <ArrowRight className="w-3 h-3 ml-auto opacity-50" />
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Quick Actions" className="text-xs font-medium text-muted-foreground px-2 py-1 mt-2">
                        <Command.Item
                            onSelect={() => runCommand(() => document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" }))}
                            className="flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer text-sm text-foreground hover:bg-muted aria-selected:bg-muted transition-colors"
                        >
                            <Terminal className="w-4 h-4" />
                            Search Repositories
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" }))}
                            className="flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer text-sm text-foreground hover:bg-muted aria-selected:bg-muted transition-colors"
                        >
                            <Activity className="w-4 h-4" />
                            View Engineering Journey
                        </Command.Item>
                    </Command.Group>

                    {repos.length > 0 && (
                        <Command.Group heading="Repositories" className="text-xs font-medium text-muted-foreground px-2 py-1 mt-2">
                            {repos.slice(0, 5).map((repo) => (
                                <Command.Item
                                    key={repo.id}
                                    onSelect={() => runCommand(() => window.open(repo.html_url, "_blank"))}
                                    className="flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer text-sm text-foreground hover:bg-muted aria-selected:bg-muted transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-primary/50" />
                                    {repo.name}
                                    <ArrowRight className="w-3 h-3 ml-auto opacity-50" />
                                </Command.Item>
                            ))}
                        </Command.Group>
                    )}
                </Command.List>
            </Command>
        </div>
    );
}
