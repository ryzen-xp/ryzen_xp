import BlurFade from "@/components/magicui/blur-fade";
import { allResearch } from "content-collections";
import Link from "next/link";
import {
  FlaskConical,
  FolderGit2,
  Tag as TagIcon,
  Calendar,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Log | Sandeep Chauhan",
  description:
    "Smart contract audits, protocol security research, and notes on Solidity, Cairo, and Soroban systems across Starknet, Stellar, and EVM.",
};

const BLUR_FADE_DELAY = 0.04;

const PROJECT_DISPLAY_NAMES: Record<string, string> = {
  "tbench-harbor": "T-Bench / Harbor Framework",
  "cli-agent-failure-recovery": "CLI Agent Failure & Recovery Research",
  "handshake-ai-tbench": "T-Bench / Harbor Framework",
  "failure-recovery-benchmark": "Failure Recovery Benchmark",
};

export default async function ResearchPage() {
  // Filter strictly for published entries
  const publishedEntries = allResearch.filter((item) => item.status === "published");

  // Sort by createdAt descending
  const sortedEntries = [...publishedEntries].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.publishedAt || "2026-01-01").getTime();
    const dateB = new Date(b.createdAt || b.publishedAt || "2026-01-01").getTime();
    return dateB - dateA;
  });

  // Group by project
  const projects = Array.from(new Set(sortedEntries.map((e) => e.project).filter(Boolean)));

  return (
    <div className="max-w-4xl mx-auto py-12 pb-24 sm:py-24 px-6">
      <section id="research">
        {/* Header */}
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div className="flex flex-col gap-3 mb-12 items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium">
              <FlaskConical className="size-3.5" />
              <span>Smart Contract Audits & Research</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Smart Contract Audits & Research
            </h1>
            <p className="text-lg text-muted-foreground max-w-[620px]">
              Security reviews, vulnerability notes, and protocol research across Solidity, Cairo, and Soroban — covering DeFi, escrow, RWA, and EVM / Starknet / Stellar systems.
            </p>
          </div>
        </BlurFade>

        {/* Entries List Grouped by Project or Chronological */}
        <div className="flex flex-col gap-10">
          {projects.length === 0 ? (
            <BlurFade delay={BLUR_FADE_DELAY * 1.5}>
              <div className="rounded-2xl border bg-card p-12 text-center space-y-4 shadow-sm">
                <FlaskConical className="size-10 text-muted-foreground mx-auto opacity-50" />
                <h3 className="text-xl font-bold">No Published Audit Logs Yet</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Smart contract audit write-ups and research notes will appear here once published.
                </p>
              </div>
            </BlurFade>
          ) : (
            projects.map((projectSlug, pIndex) => {
              const projectEntries = sortedEntries.filter((e) => e.project === projectSlug);
              const projectTitle = PROJECT_DISPLAY_NAMES[projectSlug] ?? projectSlug.replace(/-/g, " ");

              return (
                <BlurFade key={projectSlug} delay={BLUR_FADE_DELAY * (1.5 + pIndex * 0.5)}>
                  <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm relative overflow-hidden space-y-6">
                    {/* Project Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/30">
                            <FolderGit2 className="size-3" />
                            Project
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {projectEntries.length} Published {projectEntries.length === 1 ? "Log" : "Logs"}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight capitalize">{projectTitle}</h2>
                      </div>
                    </div>

                    {/* Entries Grid / List */}
                    <div className="grid grid-cols-1 gap-3">
                      {projectEntries.map((entry, entryIndex) => {
                        const slug = entry._meta.path.replace(/\.(md|mdx)$/, "");
                        const formattedDate = (entry.createdAt || entry.publishedAt || "2026-07-27").split("T")[0];

                        return (
                          <Link
                            key={`${entry._meta.filePath}-${entryIndex}`}
                            href={`/research/${slug}`}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border bg-background hover:bg-muted/60 hover:border-violet-500/40 transition-all group"
                          >
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                                  <Calendar className="size-3" />
                                  {formattedDate}
                                </span>
                                {entry.tags?.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium"
                                  >
                                    <TagIcon className="size-2.5" />
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <h3 className="text-base font-bold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1">
                                {entry.title}
                              </h3>

                              {entry.summary && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {entry.summary}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 shrink-0 sm:self-center">
                              <span>Read Log</span>
                              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </BlurFade>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
