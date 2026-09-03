import { allResearch } from "content-collections";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FlaskConical, Calendar, Tag, FolderGit2 } from "lucide-react";
import { MDXContent } from "@content-collections/mdx/react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return allResearch
    .filter((entry) => entry.status === "published")
    .map((entry) => ({
      slug: entry._meta.path.replace(/\.(md|mdx)$/, ""),
    }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const entry = allResearch.find((r) => r._meta.path.replace(/\.(md|mdx)$/, "") === slug);

  if (!entry || entry.status !== "published") return;

  return {
    title: `${entry.title} | Research Log`,
    description: entry.summary || `Research entry on ${entry.title}`,
  };
}

export default async function ResearchEntryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const publishedEntries = allResearch.filter((r) => r.status === "published");

  const currentIndex = publishedEntries.findIndex(
    (r) => r._meta.path.replace(/\.(md|mdx)$/, "") === slug
  );

  const entry = publishedEntries[currentIndex];

  if (!entry) {
    notFound();
  }

  const previousEntry = currentIndex > 0 ? publishedEntries[currentIndex - 1] : null;
  const nextEntry = currentIndex < publishedEntries.length - 1 ? publishedEntries[currentIndex + 1] : null;

  const formattedDate = (entry.createdAt || entry.publishedAt || "2026-07-27").split("T")[0];

  return (
    <div className="max-w-3xl mx-auto py-12 pb-24 sm:py-24 px-6">
      <section id="research-entry">
        {/* Navigation & Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/research"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5 inline-flex items-center gap-1 group bg-card"
            aria-label="Back to Research Logs"
          >
            <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Back to Research Log
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <FlaskConical className="size-3.5" />
            <span>Research Log</span>
          </div>
        </div>

        {/* Metadata Header */}
        <div className="space-y-4 mb-10 pb-6 border-b">
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="size-3.5" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 capitalize font-medium">
              <FolderGit2 className="size-3.5 text-amber-500" />
              {entry.project.replace(/-/g, " ")}
            </span>
          </div>

          <h1 className="title font-bold text-3xl sm:text-4xl tracking-tighter text-foreground">
            {entry.title}
          </h1>

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium"
                >
                  <Tag className="size-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Entry Article Body */}
        <article className="prose prose-neutral dark:prose-invert max-w-none prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3">
          <MDXContent code={entry.mdx} />
        </article>

        {/* Previous / Next Entry Footer Links */}
        <div className="mt-20 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          {previousEntry ? (
            <Link
              href={`/research/${previousEntry._meta.path.replace(/\.(md|mdx)$/, "")}`}
              className="flex items-center gap-2 px-4 py-3 border rounded-xl hover:bg-muted transition-colors w-full sm:w-auto text-left group"
            >
              <ChevronLeft className="size-5 group-hover:-translate-x-1 transition-transform text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Previous Log
                </span>
                <span className="font-medium text-foreground line-clamp-1">
                  {previousEntry.title}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextEntry ? (
            <Link
              href={`/research/${nextEntry._meta.path.replace(/\.(md|mdx)$/, "")}`}
              className="flex items-center justify-end gap-2 px-4 py-3 border rounded-xl hover:bg-muted transition-colors w-full sm:w-auto text-right group"
            >
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Next Log
                </span>
                <span className="font-medium text-foreground line-clamp-1">{nextEntry.title}</span>
              </div>
              <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform text-muted-foreground" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
