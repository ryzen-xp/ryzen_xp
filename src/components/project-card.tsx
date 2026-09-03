/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Markdown from "react-markdown";

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <div className="w-full h-48 bg-muted" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-48 object-contain bg-black"
      onError={() => setImageError(true)}
    />
  );
}

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  contribution?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  contribution,
  links,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col h-full border border-border rounded-xl overflow-hidden hover:ring-2 cursor-pointer hover:ring-muted transition-all duration-200",
        className
      )}
    >
      <div className="relative shrink-0">
        <Link
          href={href || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {video ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-48 object-cover"
            />
          ) : image ? (
            <ProjectImage src={image} alt={title} />
          ) : (
            <div className="w-full h-48 bg-muted" />
          )}
        </Link>
        {(() => {
          const validLinks = links?.filter(l => l.href) ?? [];
          const hasLiveDemo = links?.some(l => l.type === "Demo" && l.href);
          return (
            <>
              {validLinks.length > 0 && (
                <div className="absolute top-2 right-2 flex flex-wrap gap-2">
                  {validLinks.map((link, idx) => (
                    <Link
                      href={link.href}
                      key={idx}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Badge
                        className="flex items-center gap-1.5 text-xs bg-black text-white hover:bg-black/90"
                        variant="default"
                      >
                        {link.icon}
                        {link.type}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
              {!hasLiveDemo && (
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-medium bg-black/60 text-white backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 inline-block" />
                    Not Live
                  </span>
                </div>
              )}
            </>
          );
        })()}
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{title}</h3>
            <time className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
              {dates.split(' - ').map((part, i, arr) => {
                if (i === arr.length - 1 && (part === 'Live' || part === 'Present' || part === 'Ongoing' || part === 'Maintenance' || part === 'Working')) {
                  const isLive = part === 'Live';
                  const isMaintenance = part === 'Maintenance';
                  const isWorking = part === 'Working';
                  return (
                    <span key={i} className="flex items-center gap-1">
                      <span>-</span>
                      <span className={cn(
                        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium leading-none",
                        isLive ? "bg-green-500/15 text-green-600 dark:text-green-400"
                        : isMaintenance ? "bg-orange-500/15 text-orange-600 dark:text-orange-400"
                        : isWorking ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                        : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                      )}>
                        {isLive && (
                          <span className="relative flex h-1.5 w-1.5 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                          </span>
                        )}
                        {isMaintenance && (
                          <span className="relative flex h-1.5 w-1.5 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                          </span>
                        )}
                        {isWorking && (
                          <span className="relative flex h-1.5 w-1.5 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                          </span>
                        )}
                        {part}
                      </span>
                    </span>
                  );
                }
                if (i > 0) return <span key={i}>- {part}</span>;
                return <span key={i}>{part}</span>;
              })}
            </time>
          </div>
          <Link
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-label={`Open ${title}`}
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="text-xs flex-1 prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{description}</Markdown>
        </div>
        {contribution && (
          <div className="rounded-lg bg-muted/50 border border-border px-3 py-2 space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">My Contribution</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{contribution}</p>
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="text-[11px] font-medium border border-border h-6 w-fit px-2"
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
