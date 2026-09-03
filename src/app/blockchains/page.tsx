/* eslint-disable @next/next/no-img-element */
import { DATA } from "@/data/resume";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Blockchains | ${DATA.name}`,
  description:
    "Chains I build on most — Stellar, Starknet, Ethereum, Base, and Polygon.",
};

const BLUR_FADE_DELAY = 0.04;

export default function BlockchainsPage() {
  const primary = DATA.blockchains.filter((c) => c.focus === "Primary");
  const active = DATA.blockchains.filter((c) => c.focus === "Active");

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-background">
      <div className="w-[95%] max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col gap-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex flex-col gap-y-10 mt-4">
          <div className="flex flex-col gap-y-4 items-center justify-center">
            <div className="flex items-center w-full">
              <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
              <div className="border bg-primary z-10 rounded-xl px-4 py-1">
                <span className="text-background text-sm font-medium">
                  Ecosystems
                </span>
              </div>
              <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
            </div>
            <div className="flex flex-col gap-y-3 items-center justify-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center">
                Working Blockchains
              </h1>
              <p className="text-muted-foreground md:text-lg/relaxed text-balance text-center max-w-2xl">
                These are the chains I build on day to day. Most of my time is on
                Stellar and Starknet — smart contracts, protocol backends, and
                open-source tooling. I also ship across Ethereum and EVM L2s
                like Base and Polygon.
              </p>
            </div>
          </div>

          <section className="flex flex-col gap-4">
            <BlurFade delay={BLUR_FADE_DELAY}>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold tracking-tight">
                  Primary focus
                </h2>
                <p className="text-sm text-muted-foreground">
                  Where I spend most of my engineering time.
                </p>
              </div>
            </BlurFade>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {primary.map((chain, id) => (
                <BlurFade key={chain.name} delay={BLUR_FADE_DELAY * (id + 2)}>
                  <ChainCard chain={chain} />
                </BlurFade>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold tracking-tight">
                  Also building on
                </h2>
                <p className="text-sm text-muted-foreground">
                  EVM ecosystems I use for Solidity contracts, NFTs, and DeFi.
                </p>
              </div>
            </BlurFade>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {active.map((chain, id) => (
                <BlurFade key={chain.name} delay={BLUR_FADE_DELAY * (id + 5)}>
                  <ChainCard chain={chain} />
                </BlurFade>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ChainCard({
  chain,
}: {
  chain: (typeof DATA.blockchains)[number];
}) {
  return (
    <Link
      href={chain.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-5 h-full border border-border bg-card rounded-2xl p-6 hover:ring-2 hover:ring-muted transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-24 w-full max-w-[280px] items-center justify-center overflow-hidden">
          <img
            src={chain.logoUrl}
            alt={chain.name}
            className="h-16 w-auto max-w-full object-contain"
          />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2.5 py-1 shrink-0">
          {chain.focus}
        </span>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{chain.name}</h3>
          <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {chain.description}
        </p>
      </div>
    </Link>
  );
}
