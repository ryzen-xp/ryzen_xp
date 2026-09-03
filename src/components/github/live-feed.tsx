"use client";

import { motion } from "motion/react";
import { GitCommit, GitPullRequest, GitMerge, Star, Code, Activity, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function formatEvent(event: any) {
    switch (event.type) {
        case "PushEvent":
            return {
                icon: <GitCommit className="w-4 h-4 text-emerald-500" />,
                title: "Pushed commits",
                repo: event.repo.name,
                detail: event.payload.commits?.[0]?.message || "Updates pushed",
                color: "bg-emerald-500/10"
            };
        case "PullRequestEvent":
            return {
                icon: <GitPullRequest className="w-4 h-4 text-blue-500" />,
                title: `${event.payload.action === "opened" ? "Opened" : "Updated"} pull request`,
                repo: event.repo.name,
                detail: event.payload.pull_request?.title || "Pull request",
                color: "bg-blue-500/10"
            };
        case "WatchEvent":
            return {
                icon: <Star className="w-4 h-4 text-amber-500" />,
                title: "Starred repository",
                repo: event.repo.name,
                detail: "Showed some love",
                color: "bg-amber-500/10"
            };
        case "CreateEvent":
            return {
                icon: <Code className="w-4 h-4 text-purple-500" />,
                title: `Created ${event.payload.ref_type || "repository"}`,
                repo: event.repo.name,
                detail: event.payload.ref || "New project started",
                color: "bg-purple-500/10"
            };
        case "IssueCommentEvent":
            return {
                icon: <MessageSquare className="w-4 h-4 text-pink-500" />,
                title: "Commented on issue",
                repo: event.repo.name,
                detail: "Participated in discussion",
                color: "bg-pink-500/10"
            };
        default:
            return {
                icon: <Activity className="w-4 h-4 text-gray-500" />,
                title: event.type.replace("Event", ""),
                repo: event.repo.name,
                detail: "Activity recorded",
                color: "bg-gray-500/10"
            };
    }
}

export function LiveFeed({ events }: { events: any[] }) {
    if (!events || events.length === 0) {
        return (
            <div className="flex flex-col gap-4 p-6 border border-border rounded-xl bg-card">
                <h3 className="font-semibold">Live Development Feed</h3>
                <p className="text-sm text-muted-foreground">No recent activity found.</p>
            </div>
        );
    }

    const filteredEvents = events.slice(0, 10); // show top 10

    return (
        <section className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h3 className="font-semibold text-lg">Live Development Feed</h3>
            </div>

            <div className="relative pl-6 border-l border-border/50 ml-3 flex flex-col gap-8">
                {filteredEvents.map((event, i) => {
                    const formatted = formatEvent(event);
                    let timeAgo = "recently";
                    try {
                        const date = new Date(event.created_at);
                        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
                        if (seconds < 60) timeAgo = "just now";
                        else if (seconds < 3600) timeAgo = `${Math.floor(seconds / 60)}m ago`;
                        else if (seconds < 86400) timeAgo = `${Math.floor(seconds / 3600)}h ago`;
                        else timeAgo = `${Math.floor(seconds / 86400)}d ago`;
                    } catch(e) {}

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="relative flex flex-col gap-1.5"
                        >
                            <div className={`absolute -left-[35px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full border border-border/50 backdrop-blur-md ${formatted.color}`}>
                                {formatted.icon}
                            </div>
                            
                            <div className="flex items-baseline justify-between gap-4">
                                <h4 className="text-sm font-medium text-foreground">
                                    {formatted.title}
                                </h4>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap font-mono uppercase tracking-wider">
                                    {timeAgo}
                                </span>
                            </div>
                            
                            <a 
                                href={`https://github.com/${formatted.repo}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline w-fit font-medium"
                            >
                                {formatted.repo}
                            </a>
                            
                            <p className="text-xs text-muted-foreground truncate max-w-full">
                                {formatted.detail}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
