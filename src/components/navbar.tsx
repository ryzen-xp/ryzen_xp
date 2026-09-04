"use client";

import { usePathname } from "next/navigation";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import Link from "next/link";
import { DockHint } from "@/components/dock-hint";

const iconBtn =
  "rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors";

const tip =
  "rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]";

function DockSeparator() {
  return (
    <Separator
      orientation="vertical"
      className="hidden h-2/3 w-px shrink-0 bg-border sm:block sm:m-auto"
    />
  );
}

export default function Navbar() {
  const pathname = usePathname();

  if (pathname?.startsWith("/research/editor")) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex flex-col items-center gap-1.5 overflow-visible px-2 sm:bottom-4 sm:px-4">
      <DockHint />
      <Dock className="pointer-events-auto relative z-50 mx-auto h-14 w-full max-w-[calc(100vw-1rem)] gap-1.5 border bg-card/90 p-1.5 shadow-[0_0_10px_3px] shadow-primary/5 backdrop-blur-3xl sm:h-14 sm:w-fit sm:max-w-[calc(100vw-2rem)] sm:gap-2 sm:overflow-visible sm:p-2">
        {DATA.navbar
          .filter(
            (item) =>
              item.label !== "Spotify" &&
              item.label !== "Blockchains" &&
              item.label !== "Settings"
          )
          .map((item) => {
            const isExternal =
              item.href.startsWith("http") || item.href.endsWith(".pdf");
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="shrink-0"
                    aria-label={item.label}
                  >
                    <DockIcon className={iconBtn}>
                      <item.icon className="size-full overflow-hidden rounded-sm object-contain" />
                    </DockIcon>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8} className={tip}>
                  <p>{item.label}</p>
                  <TooltipArrow className="fill-primary" />
                </TooltipContent>
              </Tooltip>
            );
          })}

        <DockSeparator />

        {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social], index) => {
            const isGithub = name.toLowerCase() === "github";
            const href = isGithub ? "/github" : social.url;
            const isExternal = href.startsWith("http");
            const IconComponent = social.icon;

            return (
              <Tooltip key={`social-${name}-${index}`}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="shrink-0"
                    aria-label={name}
                  >
                    <DockIcon className={iconBtn}>
                      <IconComponent className="size-full overflow-hidden rounded-sm object-contain" />
                    </DockIcon>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8} className={tip}>
                  <p>{name}</p>
                  <TooltipArrow className="fill-primary" />
                </TooltipContent>
              </Tooltip>
            );
          })}

        <DockSeparator />

        {DATA.navbar
          .filter(
            (item) => item.label === "Spotify" || item.label === "Blockchains"
          )
          .map((item) => {
            const isExternal = item.href.startsWith("http");
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="shrink-0"
                    aria-label={item.label}
                  >
                    <DockIcon className={iconBtn}>
                      <item.icon className="size-full overflow-hidden rounded-sm object-contain" />
                    </DockIcon>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8} className={tip}>
                  <p>{item.label}</p>
                  <TooltipArrow className="fill-primary" />
                </TooltipContent>
              </Tooltip>
            );
          })}

        <DockSeparator />

        {DATA.navbar
          .filter((item) => item.label === "Settings")
          .map((item) => {
            const isExternal = item.href.startsWith("http");
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="shrink-0"
                    aria-label={item.label}
                  >
                    <DockIcon className={iconBtn}>
                      <item.icon className="size-full overflow-hidden rounded-sm object-contain" />
                    </DockIcon>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={8} className={tip}>
                  <p>{item.label}</p>
                  <TooltipArrow className="fill-primary" />
                </TooltipContent>
              </Tooltip>
            );
          })}

        <DockSeparator />

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex shrink-0 cursor-pointer items-center justify-center">
              <DockIcon className={iconBtn}>
                <ModeToggle className="size-full cursor-pointer" />
              </DockIcon>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={8} className={tip}>
            <p>Theme</p>
            <TooltipArrow className="fill-primary" />
          </TooltipContent>
        </Tooltip>
      </Dock>
    </div>
  );
}
